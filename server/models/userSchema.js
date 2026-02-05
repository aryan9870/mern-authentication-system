import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    unique: true,
     },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    },
    verifyOtp: {
    type: String,
    default: '',
    },
    verifyOtpExpiry: {
    type: Number,
    default: 0,
    },
    isVerified: {
    type: Boolean,
    default: false,
    },
    resetOtp: { 
    type: String,
    default: '',
    },
    resetOtpExpiry: {
    type: Number,
    default: 0,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;