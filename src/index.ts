import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NOT_FOUND } from "http-status-codes";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middlewares/error.middleware";
import { postRegister } from "./controllers/user";
// import bodyParser from "body-parser";

const app: Express = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "hello world"
  });
});

app.post("/users/register", postRegister);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(NOT_FOUND, "Router Not Found");
  next(error);
});

app.use(errorMiddleware);

const port: any = process.env.PORT || 6060;

const main = async () => {
  mongoose.set("useCreateIndex", true);
  await mongoose.connect("mongodb://localhost:27017/ts_express", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  app.listen(port, () => {
    console.log(`Server is Running at ${port}`);
  });
};
main();
