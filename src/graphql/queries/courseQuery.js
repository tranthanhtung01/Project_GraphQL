import {CourseListType, CourseType} from "../types/course";
import CourseModel from "../../model/course";
import {mutationOf, Primitives, Resolvers} from "../../utils";


export const courseList = {
    type: CourseListType,
    description: 'Get list of courses',
    args: {
        page: Primitives.int(1),
        limit: Primitives.int(3)
    },
    resolve: async (root, { page, limit}, {req}) => {
        try {
            if (page < 1) return Promise.reject(new Error('Page invalid'));
            const courses = await CourseModel.find().sort({title: 1}).limit(limit).skip((page - 1) * limit);
            if (courses.length < 1) return Promise.reject(new Error('No course remain'));
            const totalCount = await CourseModel.find().countDocuments(),
                totalPage = Math.ceil(totalCount/limit);
            return  {
                courses,
                page: page,
                limit: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                hasNextPage: page<totalPage,
            };
        } catch (e) {
            return Promise.reject(e.message);
        }
    }
}
export const courseListByAuthor = {
    type: CourseListType,
    description: 'Get list of courses by author',
    args: {
        page: Primitives.int(1),
        limit: Primitives.int(3)
    },
    resolve: async (root, {page, limit }, {req}) => {
        const { user:{ id } } = req;
        try {
            if (page < 1) return Promise.reject(new Error('Page invalid'));
            const courses = await CourseModel.find({author: id}).sort({title: 1}).limit(limit).skip((page - 1) * limit);
            if (courses.length < 1) return Promise.reject(new Error('No course remain'));
            const totalCount = await CourseModel.find({author: id}).countDocuments(),
                totalPage = Math.ceil(totalCount/limit);
            return  {
                courses,
                page: page,
                limit: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                hasNextPage: page<totalPage,
            };
        } catch (e) {
            return Promise.reject(e.message);
        }
    }
}
