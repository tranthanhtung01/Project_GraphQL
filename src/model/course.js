import mongoose, {Schema} from 'mongoose';
import UserModel from "./user";

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'UserModel',
    },
});

const CourseModel = mongoose.model('courses', courseSchema);
export default CourseModel;