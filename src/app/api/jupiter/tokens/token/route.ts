import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as { address?: string };
    if (!address)
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });

    const upstream = `https://tokens.jup.ag/token/${encodeURIComponent(address)}`;
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
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error('Jupiter token proxy error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch token info' },
      { status: 500 }
    );
  }
}
