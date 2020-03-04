import { Schema, model, Document, PaginateModel } from "mongoose";
import { IUserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";

interface Like {
  username: IPostDocument["username"];
  createAt: IPostDocument["createAt"];
}
interface IPostModel extends PaginateModel<IPostDocument> {}
export interface IPostDocument extends Document {
  body: string;
  createAt: string;
  username: string;
  user: IUserDocument["_id"];
  likes: Like[];
}

export const postSchema: Schema = new Schema({
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

postSchema.plugin(mongoosePaginate);

const Post = model<IPostDocument, IPostModel>("post", postSchema);
export default Post;
