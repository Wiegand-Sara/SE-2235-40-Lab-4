import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({ include: { orders: true } });
    res.json(users);
    return;
  } catch (error) {
    next(error);
  }
});

// Get single user
router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { orders: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });

    res.status(201).json(user);``
    return;
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email },
    });

    res.json(user);
    return;
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });

    res.json({ message: "User deleted" });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;
