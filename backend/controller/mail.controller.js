import nodemailer from 'nodemailer';
import Form from '../models/user.mail.model.js'
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import mongoose from "mongoose";


const getISTTime = () => {
    const utcTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // Convert to milliseconds
    return new Date(utcTime.getTime() + istOffset);
    }

    export const sendMail = async (req, res) => {
    const { project, vendor, leadTime, amount, approvers, userId } = req.body;
    const attachments = req.files || [];
    
    console.log('Received userId:', userId);
    console.log('Is userId a string?', typeof userId === 'string');

    const currentTime = getISTTime();

    if (!project || !vendor || !leadTime || !amount || !approvers || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Convert attachments to the expected format
    const attachmentObjects = attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer.toString('base64') // Adjust based on your file handling
    }));

    // Create a new RequestForm document
    const newData = new Form({
        project,
        vendor,
        leadTime,
        amount,
        approvers,
        attachments: attachmentObjects,
        submittedAt: currentTime,
        user: userId // Ensure this is a single ObjectId
    });

    try {
        await newData.save(); // Save the form first to get the ID

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'hemashree1910@gmail.com',
            subject: 'Request form',
            html: `
                <p>Project: ${project}</p>
                <p>Vendor: ${vendor}</p>
                <p>Delivery Lead Time: ${leadTime}</p>
                <p>Total Purchase Amount: ${amount}</p>
                <p>Approvers: ${approvers}</p>
                <p>Please click one of the following options:</p>
                <div style="display: flex; gap: 10px;">
                    <a href="http://localhost:5000/api/response?status=accept&id=${newData._id}" style="background-color: green; color: white; padding: 10px 20px; margin-right:10px; text-decoration: none; border-radius: 5px;">Accept</a>
                    <a href="http://localhost:5000/api/response?status=decline&id=${newData._id}" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Decline</a>
                </div>
            `,
            attachments: attachmentObjects.map(file => ({
                filename: file.filename,
                content: Buffer.from(file.content, 'base64') // Convert Base64 back to Buffer
            })),
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).send('Email sent successfully!');
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email.', error: error.message });
    }
};


export const response = async (req, res) => {
    console.log('Request Query:', req.query);

    const { status, id } = req.query;

    if (!status || !id) {
        return res.status(400).json({ error: 'Status and ID are required' });
    }

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId format' });
    }

    const form = await Form.findById(id).exec();

    if (!form) {
        return res.status(404).json({ error: 'Form not found' });
    }

    // Safely get attachments from the form, default to an empty array if undefined or not an array
    const attachments = Array.isArray(form.attachments) ? form.attachments : [];

    // Convert attachments to the expected format
    const attachmentObjects = attachments.map(file => ({
        filename: file.filename, // Use the correct property names from your schema
        content: file.content,   // This assumes 'content' is already in Base64 format
    }));


    console.log('Amount :', form.amount)
    const amount = form.amount
    // Handle response based on status
    if (amount >= 20000 && status === 'accept' ) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'bubududu4751@gmail.com',
            subject: "Request form",
            html: `
                    <p>Project: ${form.project}</p>
                    <p>Vendor: ${form.vendor}</p>
                    <p>Delivery Lead Time: ${form.leadTime}</p>
                    <p>Total Purchase Amount: ${form.amount}</p>
                    <p>Approvers: ${form.approvers}</p>

                    <a href="http://localhost:5000/api/response?status=accept">Accept</a>
                <br>
                <a href="http://localhost:5000/api/response?status=decline">Decline</a>
                `,
                attachments: attachmentObjects.map(file => ({
                    filename: file.filename,
                    content: Buffer.from(file.content, 'base64'), // Convert Base64 back to Buffer
                })),
        };

        try {
            await transporter.sendMail(mailOptions);

            // Update status in the database
            form.status = 'accepted';

            res.status(200).send('Email sent successfully!!');
            console.log("Email sent successfully!!");
            await form.save();
        } catch (error) {

            console.error('Error sending email:', error);
            res.status(500).send('Error sending email.');
        }
    } 
    else if(amount < 20000 && status === 'accept'){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'bubududu4751@gmail.com',
            subject: "Request form",
            html: `
                    <p>Project: ${form.project}</p>
                    <p>Vendor: ${form.vendor}</p>
                    <p>Delivery Lead Time: ${form.leadTime}</p>
                    <p>Total Purchase Amount: ${form.amount}</p>
                    <p>Approvers: ${form.approvers}</p>
                `,
            attachments: attachmentObjects,
        };

        try {
            await transporter.sendMail(mailOptions);

            // Update status in the database
            form.status = 'accepted';

            res.status(200).send('Email sent successfully!!');
            console.log("Email sent successfully!!");
            await form.save();
        } catch (error) {

            console.error('Error sending email:', error);
            res.status(500).send('Error sending email.');
        }
    }
    
    
    
    else if (status === 'decline') {
        // Check current status before declining
        // if (res.query === 'accepted') {
        //     return res.status(400).send('Cannot decline an accepted request.');
        // }
        try {
            if(form.status==='pending'){
                form.status = 'declined';
                res.status(200).send('Request declined.');
            }
            else{
                res.status(400).send('Cannot decline a request because it is already accepted');
            }
            
            await form.save();
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).send('Error updating status.');
        }
    } else {
        res.send('Invalid response.');
    }
};


export const getRequests = async (req, res) => {
    try {
        // Retrieve all documents from the Form collection
        const requests = await Form.find().exec();
        res.json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).send('Error fetching requests.');
    }
};

function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.pdf': return 'application/pdf';
        case '.jpg': return 'image/jpeg';
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.doc': return 'application/msword';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.txt': return 'text/plain';
        default: return 'application/octet-stream';
    }
}

export const getAttachments = async (req, res) => {
    const { id, filename } = req.params;

    try {
        // Convert ID to a valid MongoDB ObjectId using the 'new' keyword
        const objectId = new mongoose.Types.ObjectId(id);

        // Find the form by its ID
        const form = await Form.findById(objectId);

        if (!form) {
            return res.status(404).send('Form not found');
        }

        // Find the attachment by filename
        const attachment = form.attachments.find(att => att.filename === filename);

        if (!attachment) {
            return res.status(404).send('File not found');
        }

        // Decode base64 content and send it as a response
        const fileBuffer = Buffer.from(attachment.content, 'base64');

        // Get the MIME type using the getMimeType function
        const mimeType = getMimeType(filename);

        // Set headers to display the file inline
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-Length', fileBuffer.length);

        res.send(fileBuffer);
    } catch (error) {
        console.error('Error fetching the file:', error);
        res.status(500).send('Error fetching the file');
    }
};


export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const trimmedId = id.trim(); // Trim any extra whitespace or newlines
    console.log('Trimmed ID:', trimmedId); // Log the trimmed ID to verify
  
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }
  
    try {
      const email = await Form.findByIdAndUpdate(trimmedId, { status: status }, { new: true });
      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }
      res.json({ message: 'Email status updated successfully', email });
    } catch (error) {
      console.error('Error updating email status:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  

export const validateDetails = async (req, res) => {
    const { project, vendor, leadTime, amount, approvers } = req.body;

  try {
    const form = await Form.findOne({
      project,
      vendor,
      leadTime,
      amount,
      approvers,
    }).exec();

    if (form) {
      res.status(200).json({ message: 'Details match' });
    } else {
      res.status(404).json({ message: 'Details do not match' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }

};

export const requests = async (req, res) => {
    try {
        console.log('User ID from token:', req.user.userId); // Debug log
        const userId = req.user.userId;
        const userRequests = await Request.find({ userId: userId });
        res.status(200).json(userRequests);
    } catch (error) {
        console.error('Error in requests handler:', error); // Debug log
        res.status(500).json({ error: "Failed to fetch user requests" });
    }
};
