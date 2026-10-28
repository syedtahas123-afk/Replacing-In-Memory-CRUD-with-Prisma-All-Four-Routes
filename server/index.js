import "dotenv/config";
import express from "express";
import prisma from "./prisma/client.js";
import threadsRouter from "./routes/threads.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("/api/threads", threadsRouter);

// Central error handler for Prisma and unexpected errors.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.code === "P2025") {
    return res.status(404).json({ error: "thread not found" });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({ error: "a record with these values already exists" });
  }

  console.error(error);
  res.status(500).json({ error: "internal server error" });
});

const server = app.listen(port, () => {
  console.log(`Thread API listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
