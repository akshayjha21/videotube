import mongoose,{  Schema} from "mongoose";


const likeSchema = new Schema({
    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' },
    likedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  export const like=mongoose.model("like",likeSchema)