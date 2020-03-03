import { Schema, model, Document } from "mongoose";
import { IUserDocument } from "./User";

interface Like {
  username: IPostDocument["username"];
  createAt: IPostDocument["createAt"];
}

interface IPostDocument extends Document {
  body: string;
  createAt: string;
  username: string;
  user: IUserDocument["_id"];
  likes: Like[];
}

const PostSchema: Schema = new Schema({
  body: String,
  createAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [
    {
      username: String,
      createAt: String
    }
  ]
});

const Post = model<IPostDocument>("post", PostSchema);
export default Post;
