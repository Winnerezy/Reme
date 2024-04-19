import { model, mongoose } from "mongoose";

const SavedPostSchema = new mongoose.Schema({
    author: {
        type: String
    },
    saved: {type: mongoose.Types.ObjectId, ref: 'Posts'}
    
})


export default mongoose.model('SavedPost', SavedPostSchema)