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
    return next(
      new ExpressError("Username, email, and password are required", 400),
    );
  }

  // Check if user with the same email or username already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(
      new ExpressError("User with this email or username already exists", 400),
    );
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
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Send mail

  sendMail(
    email,
    "Welcome to my app",
    `Welcome to my mern-authentiction app. Your account has been created with email id: ${email}`,
  );

  // send response with token in cookie
  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      success: true,
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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // send response with token in cookie
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
});

const logout = asyncWrap(async (req, res, next) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const sendVerifyOtp = asyncWrap(async (req, res, next) => {
  const { id } = req.user;
  console.log(id);
  const user = await User.findById(id);
  console.log(user);

  if (!user) {
    return next(new ExpressError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new ExpressError("User already verified", 400));
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP & expiry (10 min)
  user.verifyOtp = otp;
  user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email
  await sendMail(
    user.email,
    "Verify your email (OTP)",
    `Your OTP for email verification is: ${otp}\nThis OTP is valid for 10 minutes.`,
  );

  res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
  });
});

const verifyEmail = asyncWrap(async (req, res, next) => {
  const { otp } = req.body;
  const id = req.user._id;

  if (!otp) {
    return next(new ExpressError("OTP is required", 400));
  }

  const user = await User.findOne(id);

  if (!user) {
    return next(new ExpressError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new ExpressError("Email already verified", 400));
  }

  // Check OTP
  if (user.verifyOtp !== otp) {
    return next(new ExpressError("Invalid OTP", 400));
  }

  // Check OTP expiry
  if (user.verifyOtpExpiry < Date.now()) {
    return next(new ExpressError("OTP expired", 400));
  }

  // Mark user as verified
  user.isVerified = true;
  user.verifyOtp = undefined;
  user.verifyOtpExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully 🎉",
  });
});

// Send password reset OTP
const sendResetOtp = asyncWrap(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ExpressError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ExpressError("User not found", 404));
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP & expiry (10 minutes)
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email
  await sendMail(
    email,
    "Reset your password (OTP)",
    `Your password reset OTP is ${otp}.
This OTP is valid for 10 minutes.
If you did not request this, please ignore this email.`,
  );

  res.status(200).json({
    success: true,
    message: "Password reset OTP sent to email successfully",
  });
});

//Reset user password 
const resetPassword = asyncWrap(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(new ExpressError("All fields are required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ExpressError("User not found", 404));
  }

  // OTP check
  if (
    user.resetOtp !== otp ||
    user.resetOtpExpiry < Date.now()
  ) {
    return next(new ExpressError("Invalid or expired OTP", 400));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password & clear OTP
  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});


const isAuthenticated = asyncWrap( async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are allredy logged in",
  })
}) 


export { register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword, isAuthenticated };
