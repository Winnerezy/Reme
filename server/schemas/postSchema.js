import mongoose, { Schema, model } from 'mongoose'

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        max: 50
    },
    description: {
        type: String,
        required: true,
        max: 200
    },
    photo: {
        data: String,
        contentType: String
    },
    hearts: {
        type: Array,
        default: []
    },
    authorUrl: {
        type: String
    }
}, {timestamps: true})

export default model('Posts', PostSchema)