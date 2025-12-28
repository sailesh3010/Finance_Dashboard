import { NextResponse } from "next/server";

const BASE_URL = "https://www.alphavantage.co/query";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = searchParams.get("symbol") || "IBM";

  // Default function: GLOBAL_QUOTE (best for cards)
  const functionType = searchParams.get("function") || "GLOBAL_QUOTE";

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Alpha Vantage API key missing" },
      { status: 500 }
    );
  }

  const url = `${BASE_URL}?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    // Handle Alpha Vantage rate limit message
    if (data?.Note) {
      return NextResponse.json(
        { error: "API limit reached. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Alpha Vantage data" },
      { status: 500 }
    );
  }
}
