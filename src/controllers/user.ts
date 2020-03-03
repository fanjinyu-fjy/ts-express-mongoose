import { Request, Response, NextFunction } from "express";

export const postRegister = (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.body);

  next();
};
