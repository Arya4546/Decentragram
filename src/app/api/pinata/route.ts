// src/app/api/pinata/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PINATA_BASE = "https://api.pinata.cloud";

function pinataHeaders() {
  const jwt = process.env.PINATA_JWT;
  if (jwt) {
    return { Authorization: `Bearer ${jwt}` } as Record<string, string>;
  }
  const key = process.env.PINATA_KEY;
  const secret = process.env.PINATA_SECRET;
  if (!key || !secret) throw new Error("Pinata credentials missing");
  return {
    pinata_api_key: key,
    pinata_secret_api_key: secret,
  } as Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const name = (form.get("name") as string) || "decentragram";
    const caption = (form.get("caption") as string) || "";
    const owner = (form.get("owner") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const out = new FormData();
    out.append("file", file, (file as any).name ?? "image.png");
    out.append(
      "pinataMetadata",
      JSON.stringify({
        name,
        keyvalues: {
          app: "decentragram",
          owner,
          caption,
        },
      })
    );

    const res = await fetch(`${PINATA_BASE}/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: pinataHeaders(),
      body: out as any,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Pinata upload failed", detail: text },
        { status: 500 }
      );
    }

    const json = await res.json();
    const IpfsHash = json.IpfsHash || json.Hash || json.cid;
    return NextResponse.json(
      { IpfsHash },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate" },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const search = new URL(req.url).searchParams;
    const limit = Math.min(Number(search.get("limit")) || 100, 1000);

    const url =
      `${PINATA_BASE}/data/pinList` +
      `?status=pinned&includeCount=false&pageLimit=${limit}` +
      `&metadata[keyvalues][app]=decentragram&order=desc`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...pinataHeaders(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Pinata list failed", detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    const posts = (data.rows || []).map((row: any) => {
      const ipfsHash = row.ipfs_pin_hash;
      const kv = row.metadata?.keyvalues || {};
      return {
        id: row.id || ipfsHash,
        owner: kv.owner || "0x",
        ipfsHash,
        imageUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        caption: kv.caption || "",
        createdAt: Date.parse(
          row.date_pinned || row.date_unpinned || row.date_added || new Date().toISOString()
        ),
      };
    });

    return NextResponse.json(
      { posts },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate" },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "List error" }, { status: 500 });
  }
}
