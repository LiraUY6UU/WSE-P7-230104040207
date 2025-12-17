require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1. SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security headers
app.use(helmet());

// CORS - Configure allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Rate Limiting - Prevent DDoS
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Terlalu banyak request dari IP ini, coba lagi nanti.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// ============================================
// 2. LOGGING MIDDLEWARE
// ============================================

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Morgan logging - save to file and console
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Console logging

// ============================================
// 3. BODY PARSER
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 4. REQUEST TRACKING (Custom Middleware)
// ============================================
let totalRequests = 0;
const requestStartTime = Date.now();

app.use((req, res, next) => {
  totalRequests++;
  req.requestTime = new Date().toISOString();
  next();
});

// ============================================
// 5. ROUTES
// ============================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = {
    days: Math.floor(uptime / 86400),
    hours: Math.floor((uptime % 86400) / 3600),
    minutes: Math.floor((uptime % 3600) / 60),
    seconds: Math.floor(uptime % 60)
  };

  res.status(200).json({
    status: 'success',
    message: 'Service is running healthy',
    data: {
      uptime: uptimeFormatted,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Metrics Endpoint
app.get('/api/metrics', (req, res) => {
  const uptime = process.uptime();
  const runtimeSeconds = (Date.now() - requestStartTime) / 1000;

  res.status(200).json({
    status: 'success',
    data: {
      totalRequests: totalRequests,
      averageRequestsPerSecond: (totalRequests / runtimeSeconds).toFixed(2),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      memory: {
        used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
      },
      timestamp: new Date().toISOString()
    }
  });
});

// API Info Endpoint
app.get('/api/info', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      serviceName: process.env.API_NAME || 'Movies RESTful API',
      version: process.env.API_VERSION || '1.0.0',
      description: 'RESTful API untuk manajemen data film dengan security & monitoring',
      author: process.env.AUTHOR_NAME || 'Lira Anggraini',
      nim: process.env.AUTHOR_NIM || '230104040207',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        'GET /api/movies': 'Mendapatkan semua data movies',
        'GET /api/movies/:id': 'Mendapatkan movie berdasarkan ID',
        'POST /api/movies': 'Menambah movie baru',
        'PUT /api/movies/:id': 'Mengupdate movie berdasarkan ID',
        'DELETE /api/movies/:id': 'Menghapus movie berdasarkan ID',
        'GET /api/info': 'Informasi service',
        'GET /api/health': 'Health check endpoint',
        'GET /api/metrics': 'Service metrics dan monitoring'
      },
      security: {
        helmet: 'enabled',
        cors: 'enabled',
        rateLimit: `${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests per ${(parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000} minutes`
      }
    }
  });
});

// Main Routes
app.use('/api/movies', movieRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint tidak ditemukan'
  });
});

// ============================================
// 6. GLOBAL ERROR HANDLER (harus di paling bawah)
// ============================================
app.use(errorHandler);

// ============================================
// 7. START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security: Helmet, CORS, Rate Limit enabled`);
  console.log(`📊 Monitoring endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`   - Info: http://localhost:${PORT}/api/info`);
  console.log('='.repeat(50));
});