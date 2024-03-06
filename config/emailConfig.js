import dotenv from "dotenv";
dotenv.config()
import nodemailer from "nodemailer";

console.log('process.env.EMAIL_HOST', process.env.EMAIL_HOST)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER, //admin gmail ID
    pass: process.env.EMAIL_PASS, //admin gmail password
  },
});

export default transporter

  
