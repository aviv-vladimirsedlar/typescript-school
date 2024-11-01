import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { sequelize } from "./config/database";
import { AppError } from "./errors/appError";
import auth from "./routes/userRoutes";
import todo from "./routes/todoRoutes";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", auth);

app.use("/todos", todo);

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(8080);
  })
  .catch((error) => console.log(error));

export default app;
