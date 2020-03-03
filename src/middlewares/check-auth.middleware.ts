import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JwtPayload } from "../types/Jwt";
import HttpException from "../exceptions/HttpException";
import { UNAUTHORIZED } from "http-status-codes";
// import { RequestWithUser } from "../types/RequestWithUser";

const checkAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const token = authorizationHeader.split("Bearer ")[1];
    console.log(token);
    // token存在
    if (token) {
      try {
        // 从token中解析出id
        const jwtData = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
        // 向数据库查找id是否存在
        const user = await User.findById(jwtData.id);
        // 用户名存在
        if (user) {
          req.currentUser = user;
          return next();
        } else {
          return next(new HttpException(UNAUTHORIZED, "No such user"));
        }
      } catch (error) {
        return next(new HttpException(UNAUTHORIZED, "Invalid/Expired token"));
      }
    }
    return next(
      new HttpException(UNAUTHORIZED, "Authorization token must be Bearer [token]")
    );
  }
  next(new HttpException(UNAUTHORIZED, "Authorization header must be provided"));
};

export default checkAuthMiddleware;
