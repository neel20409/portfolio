import { NextResponse } from 'next/server';

export const revalidate = 900; // Cache for 15 minutes (ISR)

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubActivityResponse {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  consistencyRate: number;
  contributions: ContributionDay[];
  recentEvents: Array<{
    id: string;
    repo: string;
    type: string;
    createdAt: string;
  }>;
}

export async function GET() {
  const username = 'neel20409';

  try {
    // 1. Fetch full contribution year matrix
    const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 900 },
      headers: { 'User-Agent': 'portfolio-app' },
    });

    let contribData: { total?: { lastYear?: number }; contributions?: ContributionDay[] } = {};
    if (contribRes.ok) {
      contribData = await contribRes.json();
    }

    const contributions: ContributionDay[] = contribData.contributions || [];
    const totalContributions = contribData.total?.lastYear || contributions.reduce((acc, c) => acc + c.count, 0);

    // Calculate Streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let activeDays = 0;

    for (let i = 0; i < contributions.length; i++) {
      const day = contributions[i];
      if (day.count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current active streak from today backwards
    for (let i = contributions.length - 1; i >= 0; i--) {
      const day = contributions[i];
      if (day.count > 0) {
        currentStreak++;
      } else if (currentStreak > 0) {
        break;
      }
    }

    const consistencyRate = contributions.length > 0 ? Math.round((activeDays / contributions.length) * 100) : 0;

    // 2. Fetch latest public events
    let recentEvents: Array<{ id: string; repo: string; type: string; createdAt: string }> = [];
    try {
      const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=5`, {
        next: { revalidate: 900 },
        headers: { 'User-Agent': 'portfolio-app' },
      });
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        if (Array.isArray(events)) {
          recentEvents = events.slice(0, 4).map((e: any) => ({
            id: e.id,
            repo: e.repo?.name || 'repository',
            type: e.type.replace('Event', ''),
            createdAt: e.created_at,
          }));
        }
      }
    } catch (e) {
      console.error('Events fetch fallback:', e);
    }

    const payload: GitHubActivityResponse = {
      username,
      totalContributions,
      currentStreak,
      longestStreak,
      activeDays,
      consistencyRate,
      contributions,
      recentEvents,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (err: any) {
    console.error('GitHub Activity API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub telemetry', details: err.message },
      { status: 500 }
    );
  }
}
