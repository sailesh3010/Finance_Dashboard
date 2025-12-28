"use client";

import React, { useState } from "react";
import { useWidgetStore } from "@/store/useWidgetStore";
import { DisplayMode } from "@/types";
import { JsonExplorer } from "./JsonExplorer";

type ApiProvider = "finnhub" | "alphavantage";

interface FormProps {
  onSuccess: () => void;
}

export const AddWidgetForm = ({ onSuccess }: FormProps) => {
  const addWidget = useWidgetStore((state) => state.addWidget);

  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // ✅ NEW
  const [symbol, setSymbol] = useState("");
  const [provider, setProvider] = useState<ApiProvider>("finnhub");
  const [interval, setInterval] = useState(30);
  const [mode, setMode] = useState<DisplayMode>("card");

  // Explorer
  const [apiData, setApiData] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buildApiUrl = () => {
    if (!symbol) return "";

    switch (provider) {
      case "finnhub":
        return `/api/finnhub?symbol=${symbol.toUpperCase()}`;
      case "alphavantage":
        return `/api/alphavantage?symbol=${symbol.toUpperCase()}`;
      default:
        return "";
    }
  };

  const testConnection = async () => {
    const apiUrl = buildApiUrl();
    if (!apiUrl) return alert("Please enter a symbol");

    setIsLoading(true);
    setApiData(null);
    setSelectedFields([]);

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setApiData(json);
    } catch {
      alert("API Error: Check symbol or API limit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const apiUrl = buildApiUrl();
    if (!name || !apiUrl) {
      return alert("Please fill all required fields");
    }

    addWidget({
      id: crypto.randomUUID(),
      name,
      description: description || undefined, // ✅ NEW
      apiUrl,
      refreshInterval: interval,
      displayMode: mode,
      selectedFields,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-200">
      <div className="space-y-4">
        {/* Widget Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            Widget Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Apple Stock"
            className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm"
          />
        </div>

        {/* Widget Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of this widget"
            rows={2}
            className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm resize-none"
          />
        </div>

        {/* API Provider */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            API Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ApiProvider)}
            className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm"
          >
            <option value="finnhub">Finnhub</option>
            <option value="alphavantage">Alpha Vantage</option>
          </select>
        </div>

        {/* Symbol */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            Symbol
          </label>
          <div className="flex gap-2">
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL, TSLA, IBM"
              className="flex-1 bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm"
            />
            <button
              type="button"
              onClick={testConnection}
              disabled={isLoading}
              className="bg-emerald-600/20 text-emerald-500 px-4 rounded-lg border border-emerald-600/30 text-xs font-bold"
            >
              {isLoading ? "TESTING..." : "TEST"}
            </button>
          </div>
        </div>

        {apiData && (
          <JsonExplorer
            data={apiData}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
          />
        )}

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Refresh (sec)
            </label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Display Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as DisplayMode)}
              className="w-full bg-[#0d1117] border border-slate-700 rounded-lg p-3 text-sm"
            >
              <option value="card">Card</option>
              <option value="table">Table</option>
              <option value="chart">Chart</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold"
        >
          Add Widget
        </button>
      </div>
    </form>
  );
};
