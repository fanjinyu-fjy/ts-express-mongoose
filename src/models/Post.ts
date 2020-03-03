import { Schema, model, Document } from "mongoose";
import { IUserDocument } from "./User";

interface IPostDocument extends Document {
  body: string;
  createAt: string;
  username: string;
  user: IUserDocument["_id"];
}

const PostSchema: Schema = new Schema({
  body: String,
  createAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Post = model<IPostDocument>("post", PostSchema);
export default Post;
