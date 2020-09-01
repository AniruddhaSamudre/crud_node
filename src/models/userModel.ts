import mongoose from 'mongoose'

export const userSchema =  new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    token: {
        type: String,
        // required: true
    }
}, {
    timestamps: true
})

export const userModel = mongoose.model('User', userSchema);

