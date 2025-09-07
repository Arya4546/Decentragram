import { NextRequest, NextResponse } from "next/server";

function isScoreValid(addr: string, score: number) {
  return score > 0 && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const { address, score } = body || {};
  if (!isScoreValid(address, Number(score))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
