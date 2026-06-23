import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const meRouter = Router();

meRouter.get("/articles", requireAuth, async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { authorId: req.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
    },
  });
  res.json({ articles });
});
