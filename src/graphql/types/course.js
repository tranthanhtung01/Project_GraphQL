import {GraphQLEnumType, GraphQLInputObjectType, GraphQLObjectType} from "graphql";
import {Primitives, Resolvers} from "../../utils";
import {UserType} from "./user";
import UserModel from "../../model/user";

export const CourseType = new GraphQLObjectType({
    name: 'course',
    description: 'Course type',
    fields: ()=>({
        id: Resolvers.id(),
        title: Resolvers.string(),
        description: Resolvers.string(),
        price: Resolvers.int(),
        author: Resolvers.ofType(UserType,'author of a course', authorResolve) ,
    }),
})
export const CourseListType = new GraphQLObjectType({
    name:'listCourse',
    description: 'list of Courses',
    fields: () =>({
        courses: Resolvers.listOfType(CourseType, 'list course', courseList),
        page: Resolvers.int(),
        limit: Resolvers.int(),
        totalPage: Resolvers.int(),
        totalCount: Resolvers.int(),
        hasNextPage: Resolvers.boolean(),
    }),
})

export const courseInput = new GraphQLInputObjectType({
    name: 'inputCourseType',
    description: 'Input Course Type',
    fields : () =>({
        title: Primitives.string(),
        description: Primitives.string(),
        price: Primitives.int(),
    })
})
const courseList = async ({courses}) => {
    return courses;
}
const authorResolve = async (course, args, {req}) => {
        try {
            //console.log(req.user)
            const { author } = course,
                foundAuthor = await UserModel.findById({_id: author});
            if (!foundAuthor) return Promise.reject(new Error('Author of course not exist'));
            return foundAuthor;
        } catch (e) {
            return Promise.reject(e.message);
        }
}