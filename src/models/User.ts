import { Schema, model, Model, Document } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  password: string;
  email: string;
}

const userSchema: Schema<IUserDocument> = new Schema({
  username: String,
  password: String,
  email: String,
  createAt: String
});

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;
