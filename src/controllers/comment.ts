import { Request, Response, NextFunction } from "express";
import { IUserDocument } from "../models/User";
import { checkBody } from "../utils/validator";
import { throwPostNotFoundError } from "../utils/throwError";
import Post from "../models/Post";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser as IUserDocument;

    const { id } = req.params;
    const { body } = req.body;

    checkBody(body);
    const post = await Post.findById(id);

    if (post) {
      post.comments.unshift({
        username: user.username,
        createAt: new Date().toISOString(),
        body
      });
      await post.save();
      res.json({
        success: true,
        data: { message: "comment created successfully", post }
      });
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};
