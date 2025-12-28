// src/services/api.ts

// -----------------------------
// API Providers
// -----------------------------
export type ApiProvider = "finnhub" | "alphavantage";

// -----------------------------
// Finnhub Endpoints
// -----------------------------
export type FinnhubEndpoint = "quote" | "profile2" | "news";

// -----------------------------
// Fetch Params
// -----------------------------
interface FetchFinancialDataParams {
  provider: ApiProvider;
  symbol: string;
  endpoint?: FinnhubEndpoint;
}

// -----------------------------
// Unified Fetch Function
// -----------------------------
export const fetchFinancialData = async ({
  provider,
  symbol,
  endpoint = "quote",
}: FetchFinancialDataParams) => {
  let url = "";

  switch (provider) {
    case "finnhub":
      url = `/api/finnhub?symbol=${symbol.toUpperCase()}&endpoint=${endpoint}`;
      break;

    case "alphavantage":
      url = `/api/alphavantage?symbol=${symbol.toUpperCase()}`;
      break;

    default:
      throw new Error("Unsupported API provider");
  }

  const response = await fetch(url);

  if (response.status === 429) {
    throw new Error("API limit reached. Please try again later.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch financial data");
  }

  return response.json();
};
