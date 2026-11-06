import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chat.js";
import historyRoutes from "./routes/history.js";
import uploadRoutes from "./routes/uploads.js";
import imageRoutes from "./routes/images.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(x => x.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("This website origin is not allowed by the API."));
  }
}));
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/", (_req, res) => res.json({
  name: "TALK AI API",
  status: "online",
  message: "Backend is running."
}));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/images", imageRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.status && err.status < 500 ? err.message : "Server error. Check Render logs."
  });
});

app.listen(PORT, () => console.log(`TALK AI API listening on ${PORT}`));
