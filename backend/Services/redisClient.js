const Redis = require('ioredis');
const crypto = require('crypto');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initializeClient();
  }

  initializeClient() {
    try {
      // Use Redis Cloud URL if available, otherwise local Redis
      const redisUrl = process.env.REDIS_URL;
      
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        }
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('⚠️ Redis connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error.message);
      this.isConnected = false;
    }
  }

  // Generate cache key from text
  generateCacheKey(text, options = {}) {
    const content = `${text}_${options.maxLength || 200}_${options.style || 'concise'}`;
    return `summary:${crypto.createHash('md5').update(content).digest('hex')}`;
  }

  // Get cached summary
  async get(key) {
    if (!this.isConnected) {
      console.log('⚠️ Redis not connected, skipping cache');
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (data) {
        console.log('✅ Cache hit for key:', key);
        return JSON.parse(data);
      }
      console.log('❌ Cache miss for key:', key);
      return null;
    } catch (error) {
      console.error('Redis get error:', error.message);
      return null;
    }
  }

  // Set cached summary with TTL (24 hours default)
  async set(key, value, ttl = 86400) {
    if (!this.isConnected) {
      console.log('⚠️ Redis not connected, skipping cache set');
      return false;
    }

    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
      console.log('✅ Cached summary with key:', key);
      return true;
    } catch (error) {
      console.error('Redis set error:', error.message);
      return false;
    }
  }

  // Delete cached summary
  async delete(key) {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.client.del(key);
      console.log('✅ Deleted cache key:', key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error.message);
      return false;
    }
  }

  // Clear all cache
  async clearAll() {
    if (!this.isConnected) {
      return false;
    }

    try {
      const keys = await this.client.keys('summary:*');
      if (keys.length > 0) {
        await this.client.del(...keys);
        console.log(`✅ Cleared ${keys.length} cache entries`);
      }
      return true;
    } catch (error) {
      console.error('Redis clear error:', error.message);
      return false;
    }
  }

  // Get cache statistics
  async getStats() {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const keys = await this.client.keys('summary:*');
      const info = await this.client.info('memory');
      
      return {
        connected: true,
        totalKeys: keys.length,
        memoryInfo: info
      };
    } catch (error) {
      console.error('Redis stats error:', error.message);
      return { connected: false, error: error.message };
    }
  }

  // Close connection
  async close() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }
}

// Export singleton instance
module.exports = new RedisClient();
