import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* =========================
   CORS Configuration
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lawsetu-oiqf0pha3-mohit200421s-projects.vercel.app',
  'https://lawsetu-oiqf0pha3-mohit200421s-projects.vercel.app/login',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
console.log('Registering auth routes at /api/auth');
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Debug route to see all registered routes
app.get("/api/debug/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: middleware.route.methods
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: '/api/auth' + handler.route.path, // Adjust based on your routes
            methods: handler.route.methods
          });
        }
      });
    }
  });
  res.json({ routes });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>LawSetu Backend</h1>
    <p>Server is running</p>
    <ul>
      <li><a href="/api/test">Test API</a></li>
      <li><a href="/api/debug/routes">View Routes</a></li>
      <li><a href="/api/auth/register">Register endpoint</a> (should show 404/405)</li>
    </ul>
  `);
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Test URLs:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/api/test`);
  console.log(`   http://localhost:${PORT}/api/auth/register`);
});