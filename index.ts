import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as mongoose from "mongoose";
import userRouter from "./routes/users";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("No mongo uri provided");
}

try {
  mongoose.connect(mongoUri).then(() => {
    console.log("✅ Connected to MongoDB");
  });
} catch (error) {}
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
