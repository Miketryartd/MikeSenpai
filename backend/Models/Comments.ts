import mongoose from "mongoose";
import { Schema } from "mongoose";
import { any } from "zod";


const commentSchema = new Schema({
    comment: {type: String, required: true},
    id: {type: Number , required: true},
    finder: {type: String, required: true},
    location: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

const Comments = mongoose.model('Comments', commentSchema);
export default Comments;

