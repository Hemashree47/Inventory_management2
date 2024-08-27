import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/ErrorHandler.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import authroutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

dotenv.config();


const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(express.json({limit:"25mb"}));
app.use(cookieParser())
app.use(errorHandler);

app.use(cors({
    origin: 'http://localhost:3000', // or your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use("/api",authroutes);

app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
})

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const sendEmail = async (emailData) => {
//     const { project, vendor, leadTime, amount, approvers, attachments } = emailData;
  
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'recipient-email@example.com', // Update with the recipient's email
//       subject: 'New Purchase Request',
//       text: `
//         Project: ${project}
//         Vendor: ${vendor}
//         Delivery Lead Time: ${leadTime}
//         Total Purchase Amount: ${amount}
//         Approvers: ${approvers}
//         Attachments: ${attachments}
//       `,
//     };
  
//     try {
//       await transporter.sendMail(mailOptions);
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw new Error('Error sending email.');
//     }
//   };

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });