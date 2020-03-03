import { Request, Response, NextFunction } from "express";
import { validateRegisterInput } from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import User, { IUserDocument } from "../models/User";

export const postRegister = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
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

    const user: IUserDocument = new User({
      username,
      password,
      email
    });

    const newUser: IUserDocument = await user.save();
    console.log(newUser);
  } catch (error) {
    next(error);
  }
};
