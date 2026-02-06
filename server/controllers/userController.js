import User from '../models/userSchema.js';
import asyncWrap from '../utils/asyncWrap.js';

const getUserDetails = asyncWrap(async (req, res) => {
    const userId = req.user.id; // auth middleware se aaya

    const user = await User.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});

export { getUserDetails }
