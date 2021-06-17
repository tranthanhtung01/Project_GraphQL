import CourseModel from '../../model/course';
import {mutationOf, Primitives} from "../../utils";
import {CourseType, courseInput} from "../types/course";
import {courseSchema} from "../../utils/validationSchema";

export const createCourse = {
    type: mutationOf(CourseType, 'CourseCreate'),
    description: 'Create a course',
    args: {
        // title: Primitives.requiredString(),
        // description: Primitives.requiredString(),
        // price: Primitives.requiredInt(),
        course: Primitives.ofType(courseInput),
    },
    resolve: async (rootValue, {course}, {req}) =>{
        const { title, description, price } = course;
        try {
            const {user: author} = req,
                { error } =  courseSchema.validate({
                     title,
                    description,
                     price
                });
            if(error) return Promise.reject(new Error(error.message));
            const newCourse = new CourseModel({
                title,
                description,
                price,
                author: author._id,
            });
            const course = await newCourse.save();

            return {
                success: true,
                msg: 'Create successfully',
                payload: course,
            };
        } catch (e) {
            return  Promise.reject(e);
        }
    }
}
export const updateCourse = {
    type: mutationOf(CourseType, 'UpdateCourse', 'Update course by id'),
    args: {
        id: Primitives.requiredString(),
        // field: Primitives.ofType(CourseFieldType),
        // value: Primitives.string(),
        updateFields: Primitives.ofType(courseInput),
    },
    resolve: async (rootValue, {id, updateFields} , { req }) =>{
        try {
            const { error } =  courseSchema.validate(
                updateFields
            );
            if(error) return Promise.reject(new Error(error.message));
            const updatedCourse = await CourseModel.updateOne({_id: id}, {$set: updateFields});
            if (updatedCourse.nModified !== 1) return Promise.reject(new Error('No field matches'))
            const foundCourse = await CourseModel.findById(id);
            return {
                success: true,
                msg: 'Update successfully',
                payload: foundCourse,

            }
        } catch (e) {
            return Promise.reject(e.message);
        }
    },
}
export const removeCourse = {
    type: mutationOf(CourseType, 'removeCourse', 'Remove a course'),
    args: {
        id: Primitives.string(),
    },
    resolve: async (rootValue, {id}, {req}) => {
        const foundCourse = await CourseModel.findById(id);
        if(!foundCourse) return Promise.reject(new Error('ID not matched'));
        const deletedCourse = await foundCourse.remove();
        console.log(deletedCourse)
        return {
            success: true,
            msg: 'Remove course successfully',
            payload: deletedCourse
        }
    }
}

