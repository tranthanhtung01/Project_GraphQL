import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mutationOf, Primitives } from '../../utils';
import { AccessTokenType } from '../types';
import UserModel from '../../model/user';
import randomize from 'randomatic';
import VerifyEmailModel from "../../model/verifyAccount";

export const signIn = {
	type: mutationOf(AccessTokenType, 'SignInResponse', 'Sign in response type'),
	description: 'Sign in an user',
	args: {
		email: Primitives.requiredString(),
		password: Primitives.requiredString()
	},
	resolve: async (rootValue, { email, password }, { req }) => {
		try {
			const user = await UserModel.emailExist(email);
			if (!user) {
				return Promise.reject(new Error(req.t('wrongCredential')));
			}
			const comparePassword = await user.comparePassword(password);
			if (!comparePassword) {
				return Promise.reject(new Error(req.t('wrongCredential')));
			}
			const accessToken = jwt.sign(
				{ userId: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: process.env.JWT_EXPIRATION }
			);
			return {
				success: true,
				msg: 'Sign in successfully',
				payload: {
					accessToken
				}
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}
};

export const signUp = {
	type: mutationOf(AccessTokenType, 'SignUpResponse', 'Sign up response type'),
	description: 'Sign up an user',
	args: {
		email: Primitives.requiredString(),
		password: Primitives.requiredString()
	},
	resolve: async (rootValue, { email, password }, { req }) => {
		try {
			const user = await UserModel.emailExist(email);
			if (user) {
				return Promise.reject(new Error(req.t('emailTaken')));
			}
			const hash = bcrypt.hashSync(password, 10),
				newUser = await new UserModel({
					email,
					password: hash,
					isActivated: false,
				}).save(),
				accessToken = jwt.sign(
					{ userId: newUser._id },
					process.env.JWT_SECRET,
					{ expiresIn: process.env.JWT_EXPIRATION }
				),
				verifyCode = randomize('0',6);
			await new VerifyEmailModel({
				digitCode: verifyCode,
				email,
			}).save();
			return {
				success: true,
				msg: 'Sign up success',
				payload: {
					accessToken,
					verifyCode
				}
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}
};
export const verifyEmail = {
	type: mutationOf(AccessTokenType, 'verifyEmail', 'verify a email'),
	args: {
		digitCode: Primitives.requiredInt(),
	},
	resolve: async (rootValue, {digitCode}, {req}) =>{
		try {
			const {user} = req,
				mailExist =await VerifyEmailModel.emailExist(user.email);
			if (!mailExist) return Promise.reject(new Error(`Email is not sign-up`));
			const verifiedEmail = mailExist.verifyEmail(digitCode);
			if (!verifiedEmail) return Promise.reject(new Error(`Verify-code is invalid`));
			await UserModel.updateOne({email: mailExist.email}, {$set: {isActivated: true}});
			return {
				success: true,
				msg: 'Email is activated successfully',
			}
		} catch (e) {
			return Promise.reject(e.message);
		}
	}
}
// verifycode => code + email
// accessToken cua user => biet dc email => verifycode tim email + code => active

// User is inactive
// Send email to user include 6 digit-code => generate vo DB
// 1 API verify token (accessToken + code) => active user len
