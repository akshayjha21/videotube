import mongoose,{  Schema} from "mongoose";

const tweetSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });


export const tweet=mongoose.model("tweet",tweetSchema)