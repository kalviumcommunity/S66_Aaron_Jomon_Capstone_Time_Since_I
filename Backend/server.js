require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");

const userRoutes = require("./routes/user");
const activityRoutes = require("./routes/activity");

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: [
    'https://timesincei.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

app.get("/", (req, res) => {
    res.send("Time Since I by Aaron Jomon");
});

app.get("/api/health", (req, res) => {
    console.log("Health check endpoint hit");
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use('/api/auth', require('./routes/auth'));

// Catch-all route for debugging
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: "Route not found",
        method: req.method,
        path: req.originalUrl,
        availableRoutes: [
            "GET /",
            "GET /api/health",
            "POST /api/auth/login",
            "POST /api/auth/signup",
            "GET /api/activities",
            "POST /api/activities",
            "GET /api/users/profile"
        ]
    });
});

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URL:', process.env.MONGO_URL ? 'Set' : 'Not set');

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("✅ MongoDB connection successful");
        console.log("Database name:", mongoose.connection.db.databaseName);
    })
    .catch((err)=>{
        console.error("❌ MongoDB connection failed:", err.message);
        console.error("Full error:", err);
    })

app.listen(PORT,()=>{
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
})