import mongoose, {Schema} from 'mongoose';

const verifyEmailSchema = new Schema({
    digitCode: String,
    email: String,
})
verifyEmailSchema.statics.emailExist = function (email){
    return this.findOne({email: email});
}

verifyEmailSchema.methods.verifyEmail = function (digitCode){
    return digitCode === this.digitCode;
}

const VerifyEmailModel = mongoose.model('verifyEmail', verifyEmailSchema);
export default VerifyEmailModel;