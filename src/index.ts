import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth";
import { articlesRouter } from "./routes/articles";
import { meRouter } from "./routes/me";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/me", meRouter);

app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
