import mongoose from 'mongoose';
import moment from 'moment';

const requestSchema = new mongoose.Schema({
    project: {
        type: String,
        required: true,
    },
    vendor: {
        type: String,
        required: true,
    },
    leadTime: {
        type:Date,
        required:true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    approvers: {
        type: String,
        required: true,
    },
    attachments: [
        {
            filename: {
                type: String,
                required: true
            },
            content: {
                type: String, // Base64 encoded content
                required: true
            }
        }
    ],
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Form = mongoose.model('RequestForm', requestSchema);

export default Form;
