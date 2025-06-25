import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const filePath = path.join(__dirname, "../data/users.json");

// Load users
const loadUsers = async () => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

// Save users
const saveUsers = async (users) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};

// Middleware for token check
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "Bearer dummy-token") {
    return res.status(401).json({ error: "Unauthorized Token" });
  }
  next();
};

// GET users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await loadUsers();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: "Failed to load Users" });
  }
});

// POST - add user
router.post("/", verifyToken, async (req, res) => {
  try {
    const users = await loadUsers();
    const { name, email, address, phone, age } = req.body;
    console.log(req.body)
    if (!name || !email || !address || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      address,
      phone,
      age,
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json(newUser);
  } catch {
    res.status(500).json({ error: "Failed To Save" });
  }
});

// POST - delete user (or change to DELETE)
router.post("/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const users = await loadUsers();

    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);
    await saveUsers(users);
    res.status(200).json({ message: "User deleted", users });
  } catch {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

export default router;
