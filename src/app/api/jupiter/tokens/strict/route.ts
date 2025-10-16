import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const upstream = 'https://tokens.jup.ag/strict';
    const response = await fetch(upstream, { method: 'GET' });
    if (!response.ok)
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: 500 }
      );

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error('Jupiter strict tokens proxy error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch strict tokens' },
      { status: 500 }
    );
  }
}
