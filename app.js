import dotenv from "dotenv";
dotenv.config()

import express from "express";
import connectDB from './config/connectionDb.js'
import cors from 'cors'
import userRouter from "./routes/userRouter.js";


const app = express();

const port = process.env.PORT || 9000;
const host = process.env.HOST 
const db_url = process.env.DATABASE_URL

connectDB(db_url)

app.use(cors())

app.use(express.json())
app.use('/user', userRouter)


app.listen(port, () => {
  console.log(`Server started successfully http://${host}:${port}`);
});
