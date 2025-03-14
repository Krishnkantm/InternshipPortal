const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user")

const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth",userRouter);
mongoose.connect("mongodb://localhost:27017/internship").then(()=>{
    console.log("Connected SUcessfully MongoDB");
})

app.listen(8000,()=>{
    console.log("Listening the port number 8000");
})