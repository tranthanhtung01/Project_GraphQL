import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const courseSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(256).required(),
    price: Joi.number().min(1).max(1000).required(),
    authorId: Joi.objectId().required(),
});
export const authorSchema = Joi.object({
    name: Joi.string()
        .min(5)
        .max(50)
        .required()
        .regex(/^[a-z ,.'-]+$/i),
    totalStudents: Joi.number().min(1).max(100).required(),
});
