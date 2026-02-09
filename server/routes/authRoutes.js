import express from 'express';
const router = express.Router();
import { register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword, isAuthenticated } from '../controllers/authController.js'
import isLoggedIn from '../middleware/userAuth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/send-verify-otp', isLoggedIn, sendVerifyOtp );
router.post("/verify-account", isLoggedIn, verifyEmail);
router.get("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

router.get("/is-auth", isLoggedIn, isAuthenticated);


export default router;

