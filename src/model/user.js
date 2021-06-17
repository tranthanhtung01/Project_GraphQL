import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	isActivated: Boolean
}, { timestamps: true });

userSchema.statics.emailExist = function (email) {
	return this.findOne({ email })
};

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password)
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
