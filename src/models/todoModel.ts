import mongoose from 'mongoose'

export const todoSchema =  new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
      
    },
    completed: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
})

export const todoModel = mongoose.model('todo', todoSchema);

