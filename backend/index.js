// Load environment variables FIRST before any other imports
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const SummaryRouter = require('./Routes/SummaryRouter');

require('./Models/db');

const PORT = process.env.PORT || 8080;


// Test route
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Body parser
app.use(bodyParser.json());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://tasks-xi-rosy.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests globally
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/summaries', SummaryRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});
// ... (previous code)

// Comprehensive diagnostic endpoint
app.get('/api/diagnostics', async (req, res) => {
  const aiService = require('./Services/aiService');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    server: {
      running: true,
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    },
    database: {
      mongoUri: !!process.env.MONGO_URI,
      connected: true // You can add actual MongoDB connection check here
    },
    authentication: {
      jwtSecret: !!process.env.JWT_SECRET
    },
    aiService: {
      ...aiService.getStatus(),
      apiKeyLength: process.env.OPENROUTER_API_KEY?.length,
      apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
      siteUrl: process.env.SITE_URL,
      siteName: process.env.SITE_NAME
    }
  };

  console.log('\n🔍 Diagnostics requested:', JSON.stringify(diagnostics, null, 2));

  res.json(diagnostics);
});

// Test AI with detailed logging
app.get('/api/test-ai', async (req, res) => {
  const aiService = require('./Services/aiService');
  
  console.log('\n🧪 Running AI service test...');
  
  const testResult = await aiService.testConnection();
  const status = aiService.getStatus();

  res.json({
    success: testResult,
    message: testResult 
      ? '✅ AI service is working correctly!' 
      : '❌ AI service test failed. Check server logs for details.',
    status: status,
    timestamp: new Date().toISOString()
  });
});

// ... (rest of the code)


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`👉 http://localhost:${process.env.JWT_SECRET}`);
});

