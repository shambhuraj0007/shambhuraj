const { Queue, Worker } = require('bullmq');
const aiService = require('./aiService');
const Summary = require('../Models/Summary');

class QueueService {
  constructor() {
    this.connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
    };

    // Initialize queue
    this.summaryQueue = new Queue('summary-generation', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 100, // Keep last 100 completed jobs
          age: 24 * 3600, // Keep for 24 hours
        },
        removeOnFail: {
          count: 50, // Keep last 50 failed jobs
        },
      },
    });

    // Initialize worker
    this.initializeWorker();

    console.log('✅ Queue service initialized');
  }

  initializeWorker() {
    this.worker = new Worker(
      'summary-generation',
      async (job) => {
        console.log(`\n🔄 Processing job ${job.id}...`);
        const { text, maxLength, style, userId, title } = job.data;

        try {
          // Update job progress
          await job.updateProgress(10);

          // Generate summary using AI service
          console.log(`📝 Generating summary for user ${userId}`);
          const result = await aiService.generateSummary(text, { maxLength, style });

          await job.updateProgress(70);

          if (!result.success) {
            throw new Error(result.error);
          }

          // Save to database
          console.log('💾 Saving summary to database...');
          const summary = new Summary({
            title: title || `Summary ${new Date().toLocaleDateString()}`,
            originalText: text,
            summarizedText: result.summary,
            createdBy: userId,
          });

          await summary.save();
          await job.updateProgress(100);

          console.log(`✅ Job ${job.id} completed successfully`);

          return {
            success: true,
            summaryId: summary._id,
            summary: result.summary,
            statistics: {
              originalWords: result.originalLength,
              summaryWords: result.summaryLength,
              compressionRatio: ((result.summaryLength / result.originalLength) * 100).toFixed(2),
            },
          };
        } catch (error) {
          console.error(`❌ Job ${job.id} failed:`, error.message);
          throw error;
        }
      },
      {
        connection: this.connection,
        concurrency: 5, // Process up to 5 jobs concurrently
      }
    );

    // Worker event listeners
    this.worker.on('completed', (job, result) => {
      console.log(`✅ Job ${job.id} completed:`, result.summaryId);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job.id} failed:`, err.message);
    });

    this.worker.on('error', (err) => {
      console.error('Worker error:', err);
    });
  }

  // Add job to queue
  async addSummarizationJob(data) {
    try {
      const job = await this.summaryQueue.add('summarize', data, {
        priority: data.priority || 1,
      });

      console.log(`📋 Job ${job.id} added to queue`);

      return {
        success: true,
        jobId: job.id,
        message: 'Summarization job queued successfully',
      };
    } catch (error) {
      console.error('Failed to add job:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get job status
  async getJobStatus(jobId) {
    try {
      const job = await this.summaryQueue.getJob(jobId);

      if (!job) {
        return {
          success: false,
          message: 'Job not found',
        };
      }

      const state = await job.getState();
      const progress = job.progress;
      const result = job.returnvalue;

      return {
        success: true,
        jobId: job.id,
        state,
        progress,
        result,
        failedReason: job.failedReason,
        timestamp: job.timestamp,
      };
    } catch (error) {
      console.error('Failed to get job status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get queue statistics
  async getQueueStats() {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        this.summaryQueue.getWaitingCount(),
        this.summaryQueue.getActiveCount(),
        this.summaryQueue.getCompletedCount(),
        this.summaryQueue.getFailedCount(),
      ]);

      return {
        success: true,
        stats: {
          waiting,
          active,
          completed,
          failed,
          total: waiting + active + completed + failed,
        },
      };
    } catch (error) {
      console.error('Failed to get queue stats:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Clean old jobs
  async cleanQueue() {
    try {
      await this.summaryQueue.clean(24 * 3600 * 1000, 100, 'completed');
      await this.summaryQueue.clean(7 * 24 * 3600 * 1000, 50, 'failed');
      
      console.log('✅ Queue cleaned');
      return { success: true };
    } catch (error) {
      console.error('Failed to clean queue:', error);
      return { success: false, error: error.message };
    }
  }

  // Close connections
  async close() {
    await this.worker.close();
    await this.summaryQueue.close();
    console.log('Queue service closed');
  }
}

// Export singleton instance
module.exports = new QueueService();
