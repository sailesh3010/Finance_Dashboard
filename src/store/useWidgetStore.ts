import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WidgetConfig } from "@/types";

interface WidgetState {
  widgets: WidgetConfig[];

  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;

  // ✅ NEW: required for rearranging widgets
  setWidgets: (newWidgets: WidgetConfig[]) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (widget) =>
        set((state) => ({
          widgets: [widget, ...state.widgets],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      // ✅ NEW ACTION
      setWidgets: (newWidgets) =>
        set({
          widgets: newWidgets,
        }),
    }),
    {
      name: "finboard-storage", // localStorage persistence
    }
  )
);
