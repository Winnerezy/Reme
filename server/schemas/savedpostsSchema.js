import { model, mongoose } from "mongoose";

const SavedPostSchema = new mongoose.Schema({
    author: {
        type: String
    },
    title: {
        type: String
    },
    hearts: {
        type: Array,
        default: []
    },
    photo: {
        data: String
    },
    description: {
        type: String
    }
})

export default mongoose.model('SavedPost', SavedPostSchema)