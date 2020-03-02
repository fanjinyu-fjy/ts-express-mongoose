import express, { Express, Request, Response } from "express";

const app: Express = express();
app.get("/", (_req: Request, res: Response) => {
  res.send("hello word");
});

const port: any = process.env.PORT || 6060;

const main = () => {
  app.listen(port, () => {
    console.log(`Server is Running at ${port}`);
  });
};
main();
