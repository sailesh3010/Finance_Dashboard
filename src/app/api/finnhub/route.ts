import { NextResponse } from "next/server";

const BASE_URL = "https://finnhub.io/api/v1";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = searchParams.get("symbol") || "AAPL";
  const endpoint = searchParams.get("endpoint") || "quote";

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key missing" },
      { status: 500 }
    );
  }

  const url = `${BASE_URL}/${endpoint}?symbol=${symbol}&token=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Finnhub data" },
      { status: 500 }
    );
  }
}
