import mongoose from "mongoose";
import { Schema } from "mongoose";


const commentSchema = new Schema({
    comment: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

const Comments = mongoose.model('User', commentSchema);
export default Comments;

