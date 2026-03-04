// app/api/link-preview/route.ts
import { NextRequest, NextResponse } from "next/server";

async function fetchOG(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Twitterbot/1.0)" },
    next: { revalidate: 3600 },
  });
  const html = await res.text();

  const getMeta = (property: string) => {
    const ogMatch = html.match(
      new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, "i")
    );
    if (ogMatch) return ogMatch[1];
    const nameMatch = html.match(
      new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
    );
    return nameMatch ? nameMatch[1] : null;
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

  return {
    title: getMeta("title") || (titleMatch ? titleMatch[1].trim() : null),
    description: getMeta("description"),
    // Never return image — we don't display it
    siteName: getMeta("site_name"),
  };
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    const data = await fetchOG(url);
    return NextResponse.json({ ...data, url });
  } catch (e) {
    console.error("link-preview error", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}