import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

const fetchRSS = async (url: string) => {
  const response = await fetch(url);
  const xml = await response.text();
  return xml;
};

export async function GET(req: Request, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);
  const rssUrl = searchParams.get("rssUrl");
  // fetch rss
  const url = (rssUrl as string) || "https://note.com/npaka/rss";
  const data = await fetchRSS(url);

  // return rss
  const response = new Response(data, {
    status: 200,
    statusText: "ok",
  });

  response.headers.append("content-type", "text/xml");

  return response;
}
