require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`📤 ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/reports', require('./routes/reports'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Women Safety Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getCurrentUser: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/updateprofile'
      }
    }
  });
});

// 404 Error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON Parsing Error:', err.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: err.message
    });
  }
  
  // Global error handler
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
});

module.exports = app;
