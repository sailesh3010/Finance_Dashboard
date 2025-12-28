"use client";
import React from "react";

interface JsonExplorerProps {
  data: any;
  selectedFields: string[];
  onToggleField: (field: string) => void;
}

export const JsonExplorer = ({
  data,
  selectedFields,
  onToggleField,
}: JsonExplorerProps) => {
  // Helper to flatten object keys for selection [cite: 127]
  const renderKeys = (obj: any, prefix = "") => {
    return Object.keys(obj).map((key) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      const isObject =
        typeof value === "object" && value !== null && !Array.isArray(value);

      if (isObject) {
        return (
          <div key={fullPath} className="ml-2">
            <span className="text-slate-500 text-[10px] uppercase font-bold">
              {key}
            </span>
            {renderKeys(value, fullPath)}
          </div>
        );
      }

      const isSelected = selectedFields.includes(fullPath);

      return (
        <button
          key={fullPath}
          type="button"
          onClick={() => onToggleField(fullPath)}
          className={`block w-full text-left px-3 py-1.5 my-1 rounded text-xs transition-colors border ${
            isSelected
              ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
              : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-mono">{key}</span>
            <span className="text-[10px] opacity-60 italic">
              {String(value).substring(0, 20)}
            </span>
          </div>
        </button>
      );
    });
  };

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-lg p-4 max-h-60 overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
        Select Fields to Display [cite: 57]
      </p>
      <div className="space-y-1">{renderKeys(data)}</div>
    </div>
  );
};
