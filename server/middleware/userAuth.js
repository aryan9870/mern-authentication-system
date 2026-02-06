import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/userSchema.js";

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ExpressError("You must be logged in", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ExpressError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ExpressError("Invalid or expired token", 401));
  }
};

export default isLoggedIn;
