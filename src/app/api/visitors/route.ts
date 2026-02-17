
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        // Check if we should increment (e.g., prevent duplicate counts from same session if needed, 
        // but for simplicity we'll just increment on mount for now, or use a simple cookie approach if requested.
        // simpler: valid request = increment)

        // Increment the 'portfolio_visitors' key
        const count = await redis.incr('portfolio_visitors');
        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        // Fallback if Redis fails (e.g. invalid credentials)
        return NextResponse.json({ count: 0 }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const count = await redis.get<number>('portfolio_visitors');
        return NextResponse.json({ count: count || 0 });
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        return NextResponse.json({ count: 0 }, { status: 500 });
    }
}
