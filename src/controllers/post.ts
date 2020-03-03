import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import validator from "validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED } from "http-status-codes";
// import { RequestWithUser } from "../types/RequestWithUser";
import { IUserDocument } from "../models/User";
import { throwPostNotFoundError } from "../utils/throwError";
import { checkBody } from "../utils/validator";

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.currentUser as IUserDocument;
    if (post) {
      if (post.likes.find(like => like.username === user.username)) {
        post.likes = post.likes.filter(like => like.username !== user.username);
      } else {
        post.likes.push({
          username: user.username,
          createAt: new Date().toISOString()
        });
      }
      await post.save();
      res.json({
        success: true,
        data: { post }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (_req: Request, res: Response, next: NextFunction) => {
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

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("user", "-password");

    if (post) {
      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

// 更新post
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const { body } = req.body;
    checkBody(body);
    const user = req.currentUser as IUserDocument;
    if (post) {
      if (post.username === user.username) {
        // const resPost = await post.update({ body });
        const resPost = await Post.findByIdAndUpdate(id, { body }, { new: true });

        res.json({
          success: true,
          data: {
            message: "updated sucessfully",
            post: resPost
          }
        });
      } else {
        throw new HttpException(UNAUTHORIZED, "Action not allowed!");
      }
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

// 删除post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.username === user.username) {
        // const resPost = await post.update({ body });
        const resPost = await Post.findByIdAndDelete(id);

        res.json({
          success: true,
          data: {
            message: "deleted sucessfully",
            post: resPost
          }
        });
      } else {
        throw new HttpException(UNAUTHORIZED, "Action not allowed!");
      }
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

// 创建post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
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

    const post = await newPost.save();
    res.json({
      success: true,
      data: {
        message: "created successful",
        post
      }
    });
  } catch (error) {
    next(error);
  }
};
