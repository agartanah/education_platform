import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "./config/env";

const app = express();
const port = config.port;

const start = async () => {
  mongoose.connect(config.mongoUri);

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Expre with TypeScript!");
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

start();
