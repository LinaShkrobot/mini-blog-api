import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const articlesRouter = Router();

articlesRouter.get("/", async (_req, res) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });
  res.json({ articles });
});

articlesRouter.get("/:id", async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json({ article });
});

const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
});

articlesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }

  const article = await prisma.article.create({
    data: {
      ...parsed.data,
      authorId: req.userId!,
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
  });

  res.status(201).json({ article });
});
