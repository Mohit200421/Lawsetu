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
// Your frontend URLs
const allowedOrigins = [
  'http://localhost:5173',        // Local Vite
  'http://localhost:3000',        // Local React
  'https://lawsetu-oiqf0pha3-mohit200421s-projects.vercel.app', // Your main Vercel URL
  'https://lawsetu-oiqf0pha3-mohit200421s-projects.vercel.app/login', 
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Check against allowed list
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith(allowedOrigin.replace('https://', 'https://'))
    )) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked: ${origin}`);
    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: [],
  maxAge: 600, // 10 minutes
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && (
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    allowedOrigins.some(allowed => origin === allowed)
  )) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK",
    message: "Backend is running",
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>LawSetu Backend API 🚀</h1>
    <p>Status: <strong>Running</strong></p>
    <p>Allowed Origins:</p>
    <ul>
      ${allowedOrigins.map(o => `<li>${o}</li>`).join('')}
    </ul>
    <p><a href="/health">Health Check</a></p>
  `);
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.message);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      yourOrigin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`🌐 Allowed origins:`);
  allowedOrigins.forEach(origin => console.log(`   ${origin}`));
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
});