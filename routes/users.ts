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
    console.log(
      "GET /api/users",
      users.length,
      "users found",
      parseInt(req.query.page as string)
    );

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// GET /api/users/search?name=John - Retrieve all users with that name
user.get("/search", async (req: Request, res: Response) => {
  let { name } = req.query as { name: string };
  try {
    if (!name) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    name = name.trim().toLowerCase();

    console.log("name", name, "...");

    const users = await User.find({
      $or: [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } },
      ],
    });

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    console.log("error");
    res.status(500).json({ message: (err as Error).message });
  }
});

// GET /api/users/:id - Retrieve a single user by id
user.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    console.log("GET /api/users/:id", user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// POST /api/users: Create a new user.
user.post("/", async (req: Request, res: Response) => {
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  });

  try {
    const newUser = await user.save();
    console.log("POST /api/users", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

export default user;
