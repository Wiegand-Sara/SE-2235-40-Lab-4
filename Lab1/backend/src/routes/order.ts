import express from "express";
const router = express.Router();

const orders = [{ id: 1, userId: 1, productId: 1, quantity: 2 }];

router.get("/", (req, res) => {
  res.json(orders);
});

router.get("/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  order ? res.json(order) : res.status(404).json({ error: "Order not found" });
});

export default router;