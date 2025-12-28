"use client";

import { useState, useMemo } from "react";
import { WidgetConfig } from "@/types";
import { useFetchWidgetData } from "@/hooks/useFetchWidgetData";
import { useWidgetStore } from "@/store/useWidgetStore";
import { StockChart } from "../widgets/StockChart";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface WidgetProps {
  config: WidgetConfig;
}

/* ---------------- HELPERS ---------------- */

const getValueByPath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;

  let current = obj;
  const parts = path.split(".");

  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;

    if (current[parts[i]] !== undefined) {
      current = current[parts[i]];
      continue;
    }

    const remainingKey = parts.slice(i).join(".");
    if (current[remainingKey] !== undefined) return current[remainingKey];

    return undefined;
  }

  return current;
};

const formatLabel = (field: string) => {
  if (field === "c") return "Current Price";
  if (field === "dp") return "Change %";
  if (field === "d") return "Change";
  if (field === "h") return "Day High";
  if (field === "l") return "Day Low";
  if (field === "o") return "Open Price";
  if (field === "pc") return "Previous Close";

  return field
    .replace("Global Quote.", "")
    .replace(/\d+\.\s*/, "")
    .replace(/_/g, " ")
    .toUpperCase();
};

const renderValue = (key: string, value: any) => {
  if (value === undefined || value === null) return "N/A";
  if (typeof value === "string" && value.includes("%")) return value;

  const num = Number(value);
  if (Number.isNaN(num)) return String(value);

  if (key === "c" || key.toLowerCase().includes("price")) {
    return formatCurrency(num);
  }

  if (key === "dp" || key.toLowerCase().includes("change")) {
    return formatPercent(num);
  }

  return num.toLocaleString();
};

/* ---------------- COMPONENT ---------------- */

export const Widget = ({ config }: WidgetProps) => {
  const { data, loading, error } = useFetchWidgetData(
    config.apiUrl,
    config.refreshInterval
  );

  const removeWidget = useWidgetStore((state) => state.removeWidget);

  /* -------- TABLE STATE -------- */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filteredFields = useMemo(() => {
    return config.selectedFields.filter((field) =>
      formatLabel(field).toLowerCase().includes(search.toLowerCase())
    );
  }, [config.selectedFields, search]);

  const totalPages = Math.ceil(filteredFields.length / PAGE_SIZE);

  const paginatedFields = filteredFields.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl relative flex flex-col min-h-[180px] transition-colors">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[85%]">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
            {config.name}
          </h3>

          {config.description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {config.description}
            </p>
          )}

          <span className="inline-block mt-2 text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">
            {config.displayMode}
          </span>
        </div>

        <button
          onClick={() => removeWidget(config.id)}
          className="text-slate-400 hover:text-red-500"
          aria-label="Remove widget"
        >
          ✕
        </button>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="flex-grow">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-xs">{error}</div>
        ) : (
          <>
            {/* ---------- CARD ---------- */}
            {config.displayMode === "card" && (
              <div className="space-y-3">
                {config.selectedFields.map((field) => {
                  const value = getValueByPath(data, field);

                  return (
                    <div
                      key={field}
                      className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2"
                    >
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                        {formatLabel(field)}
                      </span>
                      <span className="text-slate-900 dark:text-white font-mono font-bold">
                        {renderValue(field, value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- TABLE ---------- */}
            {config.displayMode === "table" && (
              <div className="space-y-3">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search fields..."
                  className="w-full bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-slate-700 rounded p-2 text-xs text-slate-800 dark:text-slate-300"
                />

                <table className="w-full text-[11px] text-slate-600 dark:text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="pb-2 text-left">Field</th>
                      <th className="pb-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFields.map((field) => {
                      const value = getValueByPath(data, field);

                      return (
                        <tr
                          key={field}
                          className="border-b border-slate-200 dark:border-slate-800/50"
                        >
                          <td className="py-2">{formatLabel(field)}</td>
                          <td className="py-2 text-right text-slate-900 dark:text-white font-mono">
                            {renderValue(field, value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>
                    Page {page} of {totalPages || 1}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage((p) => p + 1)}
                      className="disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- CHART ---------- */}
            {config.displayMode === "chart" && (
              <StockChart
                data={(data as any)?.history || []}
                dataKey={config.selectedFields[0]}
              />
            )}
          </>
        )}
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="mt-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3">
        <span className="text-[9px] text-slate-500 font-mono">
          ID: {config.id.split("-")[0]}
        </span>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold">
          LIVE
        </span>
      </div>
    </div>
  );
};
