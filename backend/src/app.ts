import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import apiV1 from "./route/v1";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", apiV1);

// error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    detail: err,
  });
});

export default app;
