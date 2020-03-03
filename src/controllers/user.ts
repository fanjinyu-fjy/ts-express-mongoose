import { Request, Response, NextFunction } from "express";
import { validateRegisterInput } from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import User, { IUserDocument } from "../models/User";

export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    const { errors, valid } = validateRegisterInput(
      username,
      password,
      confirmPassword,
      email
    );
    if (!valid) {
      throw new HttpException(
        UNPROCESSABLE_ENTITY,
        "User register input error",
        errors
      );
    }

    const user = await User.findOne({ username });
    if (user) {
      throw new HttpException(UNPROCESSABLE_ENTITY, "Username is existed", {
        username: "The username is exist"
      });
    }

    const newUser: IUserDocument = new User({
      username,
      password,
      email
    });

    const resUser: IUserDocument = await newUser.save();

    res.json({
      success: true,
      data: {
        user: resUser._doc
      }
    });
  } catch (error) {
    next(error);
  }
};
