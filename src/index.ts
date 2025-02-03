import express, { Request, Response } from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

const start = async () => {
  mongoose.connect("mongodb://localhost:27017/portal");

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Expre with TypeScript!");
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

start();
