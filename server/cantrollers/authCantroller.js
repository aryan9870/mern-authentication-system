import asyncWrap from "../utils/asyncWrap.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";
import sendMail from "../config/nodemailer.js";


const register = asyncWrap(async (req, res, next) => {

    // Extract user details from request body
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return next(new ExpressError("Username, email, and password are required", 400));
    }

    // Check if user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return next(new ExpressError("User with this email or username already exists", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    await newUser.save();   

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Send mail 

    sendMail(email, 'Welcome to my app', `Welcome to my mern-authentiction app. Your account has been created with email id: ${email}`);

    // send response with token in cookie
    res.status(201).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        },
    });

});


const login = asyncWrap(async (req, res, next) => {

    // Extract login details from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ExpressError("Email and password are required", 400));
    }

    // Check if user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ExpressError("Invalid email or password", 400));
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        return next(new ExpressError("Invalid email or password", 400));
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // send response with token in cookie
    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
});


const logout = asyncWrap(async (req, res, next) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }).json({
        message: "User logged out successfully",
    });
});





export { register, login, logout };

