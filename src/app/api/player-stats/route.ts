import { NextResponse } from 'next/server';

const LEETIFY_API_KEY = process.env.LEETIFY_API_KEY || 'b320d6da-50f4-431e-94d8-a601afb56a90';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steam_id = searchParams.get('steam_id');

  if (!steam_id) {
    return NextResponse.json({ success: false, error: 'Missing steam_id' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steam_id}`, {
      headers: {
        'Authorization': `Bearer ${LEETIFY_API_KEY}`
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch from Leetify' }, { status: res.status });
    }

    const json = await res.json();

    let mira = 50, nocao = 50, utilitaria = 50, movimentacao = 50, impacto = 50;
    let hsPercentage = 0;
    let totalMatches = 0;
    let leetifyRating = 0;
    let ctRating = 0;
    let tRating = 0;
    let timeToDamage = 0;
    let crosshairPlacement = 0;
    
    if (json.rating) {
      mira = Math.round(json.rating.aim) || 50;
      nocao = Math.round(json.rating.positioning) || 50;
      utilitaria = Math.round(json.rating.utility) || 50;
      
      if (json.rating.ct_leetify) ctRating = json.rating.ct_leetify * 100;
      if (json.rating.t_leetify) tRating = json.rating.t_leetify * 100;
      
      if (json.ranks && json.ranks.leetify !== null) {
         leetifyRating = json.ranks.leetify;
         let impactScore = (leetifyRating + 5) * 10;
         impacto = Math.min(Math.max(Math.round(impactScore), 1), 99);
      }
    }
    
    if (json.stats) {
      if (json.stats.counter_strafing_good_shots_ratio) {
         movimentacao = Math.min(Math.max(Math.round(json.stats.counter_strafing_good_shots_ratio), 1), 99);
      }
      if (json.stats.accuracy_head) {
         hsPercentage = Math.round(json.stats.accuracy_head);
      }
      if (json.stats.reaction_time_ms) {
         timeToDamage = Math.round(json.stats.reaction_time_ms);
      }
      if (json.stats.preaim) {
         crosshairPlacement = Math.round(json.stats.preaim);
      }
    }
    
    let recentMatches = [];
    if (json.recent_matches) {
       totalMatches = json.total_matches;
       recentMatches = json.recent_matches.slice(0, 10).reverse(); // Os 10 mais recentes em ordem cronológica
    }

    return NextResponse.json({
      success: true,
      stats: {
        mira,
        nocao,
        utilitaria,
        movimentacao,
        hsPercentage,
        totalMatches,
        recentMatches,
        leetifyRating,
        ctRating,
        tRating,
        timeToDamage,
        crosshairPlacement
      }
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
