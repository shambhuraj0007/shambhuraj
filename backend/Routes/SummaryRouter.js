const express = require('express');
const router = express.Router();
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
  getQueueStats
} = require('../Controllers/SummaryController');

// All routes require authentication
router.use(ensureAuthenticated);

// AI summarization routes
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
