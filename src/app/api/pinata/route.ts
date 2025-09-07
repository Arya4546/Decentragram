import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const name = (form.get("name") as string) || undefined;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const PINATA_JWT = process.env.PINATA_JWT;
    const PINATA_KEY = process.env.PINATA_KEY;
    const PINATA_SECRET = process.env.PINATA_SECRET;

    const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const body = new FormData();
    body.append("file", file, name || (file as any).name || "upload");

    const headers: Record<string, string> = {};
    if (PINATA_JWT) {
      headers["Authorization"] = `Bearer ${PINATA_JWT}`;
    } else if (PINATA_KEY && PINATA_SECRET) {
      headers["pinata_api_key"] = PINATA_KEY;
      headers["pinata_secret_api_key"] = PINATA_SECRET;
    } else {
      return NextResponse.json({ error: "Pinata credentials missing" }, { status: 500 });
    }

    const res = await fetch(pinataUrl, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Pinata upload failed", detail: text }, { status: 500 });
    }

    const json = await res.json();
    // v1 returns IpfsHash
    const IpfsHash = json.IpfsHash || json.Hash || json.cid;
    return NextResponse.json({ IpfsHash, raw: json }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 500 });
  }
}
