import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light";

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",

      toggleTheme: () =>
        set({
          theme: get().theme === "dark" ? "light" : "dark",
        }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "finboard-theme", // localStorage key
    }
  )
);
