import mongoose,{  Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

commentSchema.plugin(mongooseAggregatePaginate)
export const comment=mongoose.model("comment",commentSchema)