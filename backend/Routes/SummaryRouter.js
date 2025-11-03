const express = require('express');
const router = express.Router();
const multer = require('multer');
const ensureAuthenticated = require('../Middlewares/Auth');
const {
  generateAISummary,
  createSummary,
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary,
  getSummaryStats,
  queueSummarization,
  getJobStatus,
  getQueueStats,
  summarizeFromURL,
  summarizeFromFile
} = require('../Controllers/SummaryController');

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// Test route (no auth required for debugging)
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Summary routes are working!',
    availableRoutes: [
      'POST /summaries/generate',
      'POST /summaries/generate/url',
      'POST /summaries/generate/file',
      'POST /summaries/queue',
      'GET /summaries/job/:jobId',
      'GET /summaries',
      'POST /summaries',
      'GET /summaries/:id',
      'PUT /summaries/:id',
      'DELETE /summaries/:id'
    ]
  });
});

// All routes below require authentication
router.use(ensureAuthenticated);

// AI summarization routes (specific routes MUST come before generic ones)
router.post('/generate/url', summarizeFromURL);     // Summarize from URL
router.post('/generate/file', upload.single('file'), summarizeFromFile); // Summarize from file
router.post('/generate', generateAISummary);        // Sync AI summary generation
router.post('/queue', queueSummarization);          // Async job queue
router.get('/job/:jobId', getJobStatus);            // Get job status
router.get('/queue/stats', getQueueStats);          // Queue statistics

// Summary CRUD routes
router.post('/', createSummary);
router.get('/', getAllSummaries);
router.get('/stats', getSummaryStats);
router.get('/:id', getSummaryById);
router.put('/:id', updateSummary);
router.delete('/:id', deleteSummary);

module.exports = router;
