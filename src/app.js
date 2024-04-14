import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env",
  });
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true, limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes setup
import userRouter from "./routes/users_router.js";



app.use("/api/v1/user",userRouter);





export default app;