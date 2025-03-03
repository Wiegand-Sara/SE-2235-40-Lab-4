import express from "express";
const router = express.Router();

// Dummy data (replace with database calls later)
const users = [{ id: 1, name: "John Doe", email: "john@example.com" }];

// Get all users
router.get("/", (req, res) => {
  res.json(users);
});

// Get user by ID
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

export default router;