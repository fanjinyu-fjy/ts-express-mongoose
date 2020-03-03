import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import validator from "validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import { RequestWithUser } from "../types/RequestWithUser";
import { IUserDocument } from "../models/User";

export const getPost = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser as IUserDocument;

    const { body } = req.body;

    if (validator.isEmpty(body.trim())) {
      throw new HttpException(UNPROCESSABLE_ENTITY, "Body must not be empty", {
        body: "The body must not be empty"
      });
    }

    const newPost = new Post({
      body,
      createdAt: new Date().toISOString(),
      username: user.username,
      user: user.id
    });

    await newPost.save();
    res.json({
      success: true,
      data: {
        message: "created successful"
      }
    });
  } catch (error) {
    next(error);
  }
};
