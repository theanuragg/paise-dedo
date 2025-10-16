import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      ids,
      vsToken = 'USDC',
      days = '7',
    } = (await req.json()) as { ids?: string; vsToken?: string; days?: string };
    if (!ids)
      return NextResponse.json({ error: 'Missing ids' }, { status: 400 });

    const upstream = `https://price.jup.ag/v6/price/history?ids=${encodeURIComponent(ids)}&vsToken=${encodeURIComponent(vsToken)}&days=${encodeURIComponent(days)}`;
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
        'Cache-Control': 's-maxage=15, stale-while-revalidate=30',
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error('Jupiter price history proxy error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}
