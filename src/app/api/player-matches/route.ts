import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steam_id');

  if (!steamId) {
    return NextResponse.json({ success: false, error: 'Missing steam_id' }, { status: 400 });
  }

  const apiKey = process.env.PARSE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.parse.bot/scraper/758b30c6-74c7-46ea-a4fb-2efd60740f7c/get_player_matches?steam_id=${steamId}`, {
      headers: { 'X-API-Key': apiKey, 'API-Snapshot-Version': '6' },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data && json.data.matches) {
        return NextResponse.json({ success: true, matches: json.data.matches });
      }
    }
    
    return NextResponse.json({ success: false, error: 'Matches not found or API error' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching player matches:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
