import jwt from 'jsonwebtoken';
import UserModel from '../model/user';

export async function authenticationMiddleware(req, res, next) {
	try {
		const { headers: { authorization } } = req;
		if (!authorization) {
			return next()
		}
		const accessToken = authorization.split(' ')[1];

		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
		if (!decoded) {
			return next()
		}
		const user = await UserModel.findById(decoded.userId);
		if (!user) {
			return next()
		}
		Object.assign(req, {
			user,
			accessToken
		});
		return next()
	} catch (e) {
		return next()
	}
}
