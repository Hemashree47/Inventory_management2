import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true

    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RequestForm',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
