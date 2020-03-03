import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NOT_FOUND } from "http-status-codes";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middlewares/error.middleware";
import { postRegister, postLogin } from "./controllers/user";
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost
} from "./controllers/post";
import checkAuthMiddleware from "./middlewares/check-auth.middleware";
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
app.post("/users/login", postLogin);

app
  .route("/posts")
  .get(getPosts)
  .post(checkAuthMiddleware, createPost);
app
  .route("/posts/:id")
  .get(getPost)
  .put(checkAuthMiddleware, updatePost)
  .delete(checkAuthMiddleware, deletePost);

// app.get("/posts", getPost);
// app.post("/posts", createPost);

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
