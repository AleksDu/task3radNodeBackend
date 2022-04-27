import { Request, Response, NextFunction } from "express";
import express from 'express'
import { ErrorRequestHandler } from "express";
import logger from "morgan";
import cors from "cors";
import { HttpCode, LIMIT_JSON } from './lib/constants';

import notesRouter from './routes/api/notes';

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON }));
// app.use(express.urlencoded({ extended: false }));
app.use((req: Request, next: NextFunction) => {
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});

app.use("/api/notes", notesRouter);

app.use(( res: Response) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

const errorHandler: ErrorRequestHandler= (err, res) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    status: "fail",
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
};

app.use(errorHandler);

export default app;
