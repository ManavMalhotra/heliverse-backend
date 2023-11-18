"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const user = express_1.default.Router();
// GET /api/users - Retrieve all users with pagination support
user.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    try {
        const users = yield User_1.default.find({})
            .skip((page - 1) * limit)
            .limit(limit);
        console.log("GET /api/users", users.length, "users found", parseInt(req.query.page));
        if (!users || users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// GET /api/users/search?name=John - Retrieve all users with that name
user.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = req.query;
    try {
        if (!name) {
            return res.status(400).json({ message: "Please provide a search query" });
        }
        name = name.trim().toLowerCase();
        console.log("name", name, "...");
        const users = yield User_1.default.find({
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
    }
    catch (err) {
        console.log("error");
        res.status(500).json({ message: err.message });
    }
}));
// GET /api/users/:id - Retrieve a single user by id
user.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield User_1.default.findById(id);
        console.log("GET /api/users/:id", user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// POST /api/users: Create a new user.
user.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.default({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    });
    try {
        const newUser = yield user.save();
        console.log("POST /api/users", newUser);
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
exports.default = user;
