import { UserType, UserListType } from '../types';
import UserModel from '../../model/user';
import {Primitives} from "../../utils";
import CourseModel from "../../model/course";


export const user = {
	type: UserType,
	description: 'Get profile of a User',
	resolve: async (root, args, context) => {
		const { user: authUser } = context.req,
			user = await UserModel.findById(authUser._id);
		if (!user) {
			return Promise.reject(new Error('User not found'));
		}
		return user;
	},
};
export const listUser = {
	type: UserListType,
	description: 'listing user',
	args:{
		limit: Primitives.int(4),
		page: Primitives.int(1),
	},
	resolve: async (rootValue, {limit, page}, {req}) => {
		if (page < 1) return Promise.reject(new Error('Page invalid'));
		const foundUsers = await UserModel.find().sort({createdAt: 1}).limit(limit).skip((page - 1) * limit);
		if (foundUsers.length < 1) return Promise.reject(new Error('No course remain'));
		const totalCount = await UserModel.find().countDocuments(),
			totalPage = Math.ceil(totalCount/limit);
		return {
			foundUsers,
			page,
			limit,
			totalCount,
			totalPage,
			hasNextPage: page<totalPage,
		}
	}
}