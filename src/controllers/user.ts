import { Request, Response, NextFunction } from "express";
import { validateRegisterInput } from "../utils/validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import User, { IUserDocument } from "../models/User";
// import bcrypt from "bcryptjs";
import "dotenv/config";

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

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUserDocument = new User({
      username,
      password,
      // password: hashedPassword,
      email
    });

    const resUser: IUserDocument = await newUser.save();

    const token = resUser.generateToken();

    res.json({
      success: true,
      data: {
        user: token
      }
    });
  } catch (error) {
    next(error);
  }
};
