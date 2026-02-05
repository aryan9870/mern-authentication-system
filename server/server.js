import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';


const PORT = process.env.PORT || 5000;


connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});