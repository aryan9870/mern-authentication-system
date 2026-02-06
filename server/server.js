import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import ExpressError from './utils/ExpressError.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"

const PORT = process.env.PORT || 5000;


connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (re, res) => {
    res.send("Welcome to root");
})

app.use('/api/auth/', authRouter);
app.use('/api/user/', userRouter);

// 404 Not Found handler
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    // Set default status code and message if not provided
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});