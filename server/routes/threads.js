import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// GET /api/threads — return threads newest first.
router.get("/", async (req, res, next) => {
  try {
    const threads = await prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(threads);
  } catch (error) {
    next(error);
  }
});

// POST /api/threads — create a thread in the database.
router.post("/", async (req, res, next) => {
  try {
    const { title, body } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    if (body !== undefined && typeof body !== "string") {
      return res.status(400).json({ error: "body must be a string" });
    }

    const thread = await prisma.thread.create({
      data: {
        title: title.trim(),
        body: body ?? "",
      },
    });

    res.status(201).json(thread);
  } catch (error) {
    next(error);
  }
});

// PUT /api/threads/:id — update the supplied fields of a thread.
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "id must be a positive integer" });
    }

    const { title, body } = req.body ?? {};
    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "title must be a non-empty string" });
      }
      data.title = title.trim();
    }

    if (body !== undefined) {
      if (typeof body !== "string") {
        return res.status(400).json({ error: "body must be a string" });
      }
      data.body = body;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "provide title or body to update" });
    }

    const thread = await prisma.thread.update({
      where: { id },
      data,
    });

    res.status(200).json(thread);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/threads/:id — delete a thread from the database.
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "id must be a positive integer" });
    }

    const deletedThread = await prisma.thread.delete({
      where: { id },
    });

    res.status(200).json(deletedThread);
  } catch (error) {
    next(error);
  }
});

export default router;
