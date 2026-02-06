import express from 'express';
const router = express.Router();
import { getUserDetails } from '../controllers/userController.js';
import isLoggedIn from '../middleware/userAuth.js';

router.get("/me", isLoggedIn, getUserDetails);


export default router;

