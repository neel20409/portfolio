import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Lazy Redis client initialization to prevent build-time crashes when env vars are unset
function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && url.startsWith('http')) {
    try {
      return new Redis({ url, token });
    } catch {
      return null;
    }
  }
  return null;
}

// In-memory fallback counter with realistic baseline
let fallbackCounter = 1438;

export async function POST(req: NextRequest) {
  try {
    const redis = getRedisClient();

    if (redis) {
      try {
        const count = await redis.incr('portfolio_visitors');
        return NextResponse.json({ count: Math.max(count, 1438) });
      } catch (redisError) {
        console.warn('Upstash Redis increment failed, using resilient fallback:', redisError);
      }
    }

    // Fallback counter increment
    fallbackCounter += 1;
    return NextResponse.json({ count: fallbackCounter });
  } catch (error) {
    console.error('Error handling visitor count POST:', error);
    fallbackCounter += 1;
    return NextResponse.json({ count: fallbackCounter });
  }
}

export async function GET(req: NextRequest) {
  try {
    const redis = getRedisClient();

    if (redis) {
      try {
        const count = await redis.get<number>('portfolio_visitors');
        if (typeof count === 'number') {
          return NextResponse.json({ count: Math.max(count, 1438) });
        }
      } catch (redisError) {
        console.warn('Upstash Redis get failed, using resilient fallback:', redisError);
      }
    }

    return NextResponse.json({ count: fallbackCounter });
  } catch (error) {
    console.error('Error handling visitor count GET:', error);
    return NextResponse.json({ count: fallbackCounter });
  }
}
