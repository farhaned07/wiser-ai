import Redis from 'ioredis';

// Initialize Redis client with fallback to mock implementation if connection fails
let redis: Redis | null = null;

try {
  redis = new Redis(process.env.REDIS_URL || '');
  
  // Handle connection errors
  redis.on('error', (error) => {
    console.warn('Redis connection error:', error.message);
    // Don't log the full error stack trace to reduce console noise
  });
} catch (error) {
  console.warn('Failed to initialize Redis:', error);
}

/**
 * Get a value from Redis cache with fallback
 * @param key Cache key
 * @returns Cached value or null if not found
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set a value in Redis cache with expiration
 * @param key Cache key
 * @param value Value to cache
 * @param expiryInSeconds Expiration time in seconds (default: 1 hour)
 */
export async function setInCache<T>(
  key: string,
  value: T,
  expiryInSeconds: number = 3600
): Promise<void> {
  if (!redis) return;
  
  try {
    await redis.set(key, JSON.stringify(value), 'EX', expiryInSeconds);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Delete a value from Redis cache
 * @param key Cache key
 */
export async function deleteFromCache(key: string): Promise<void> {
  if (!redis) return;
  
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Clear all cache with a specific prefix
 * @param prefix Key prefix to match
 */
export async function clearCacheByPrefix(prefix: string): Promise<void> {
  if (!redis) return;
  
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis clear by prefix error:', error);
  }
}

/**
 * Get Redis client instance
 * @returns Redis client or null if not connected
 */
export function getRedisClient(): Redis | null {
  return redis;
} 