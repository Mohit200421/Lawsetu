import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* =========================
   CORS (FINAL, NO-BS VERSION)
========================= */
app.use(
  cors({
    origin: true, // 🔥 reflect request origin automatically
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 Explicit preflight handling (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("LawSetu API Running");
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
