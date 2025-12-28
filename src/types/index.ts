export type DisplayMode = "card" | "table" | "chart";

export interface WidgetConfig {
  id: string;
  name: string;
  description?: string; // ✅ NEW: widget description
  apiUrl: string;
  refreshInterval: number; // In seconds
  displayMode: DisplayMode;
  selectedFields: string[];
}
