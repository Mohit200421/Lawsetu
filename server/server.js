import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* =========================
   CORS (FINAL – VERCEL SAFE)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      // Allow localhost
      if (
        origin.startsWith("http://localhost:5173") ||
        origin.startsWith("http://localhost:3000")
      ) {
        return callback(null, true);
      }

      // ✅ Allow ALL Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
