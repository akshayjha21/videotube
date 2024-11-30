
import mongoose,{ Schema} from "mongoose";


const playlistSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  export const playlist=mongoose.models("User",playlistSchema)