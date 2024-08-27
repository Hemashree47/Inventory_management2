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
        type: Date,
        required: true,
        set: (value) => {
            // Check if the value is a valid date string in the expected format
            const date = moment(value, 'DD-MM-YYYY', true); // 'true' for strict parsing
            if (!date.isValid()) {
                throw new Error('Invalid date format for leadTime. Expected format is DD-MM-YYYY.');
            }
            return date.toDate(); // Convert to Date object
        }
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
    attachments: {
        filename: Object,
        content: String, // Base64 encoded content
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
});

const Form = mongoose.model('RequestForm', requestSchema);

export default Form;
