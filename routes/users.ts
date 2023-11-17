import express, { Express, Request, Response } from "express";
import User from "../models/User";

const user = express.Router();

// GET /api/users - Retrieve all users with pagination support
user.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const users = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("GET /api/users", users.length);

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default user;
