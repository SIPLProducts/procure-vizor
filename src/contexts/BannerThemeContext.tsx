import { createContext, useContext, useState, ReactNode } from "react";

export const colorSchemes = {
  brand: {
    name: "DICABS Brand",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadow: "shadow-emerald-500/20",
  },
  ocean: {
    name: "Deep Blue",
    gradient: "from-blue-600 via-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  sunset: {
    name: "Warm Sunset",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    shadow: "shadow-orange-500/20",
  },
  elegant: {
    name: "Dark Elegant",
    gradient: "from-slate-700 via-slate-600 to-zinc-600",
    shadow: "shadow-slate-500/20",
  },
  purple: {
    name: "Royal Purple",
    gradient: "from-purple-600 via-violet-500 to-fuchsia-500",
    shadow: "shadow-purple-500/20",
  },
  forest: {
    name: "Forest Green",
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    shadow: "shadow-green-500/20",
  },
  rose: {
    name: "Rose Gold",
    gradient: "from-rose-500 via-pink-500 to-red-400",
    shadow: "shadow-rose-500/20",
  },
  midnight: {
    name: "Midnight",
    gradient: "from-indigo-900 via-purple-900 to-slate-900",
    shadow: "shadow-indigo-500/20",
  },
};

export type ColorSchemeKey = keyof typeof colorSchemes;

interface BannerThemeContextType {
  selectedScheme: ColorSchemeKey;
  setSelectedScheme: (scheme: ColorSchemeKey) => void;
  currentScheme: typeof colorSchemes[ColorSchemeKey];
}

const BannerThemeContext = createContext<BannerThemeContextType | undefined>(undefined);

export function BannerThemeProvider({ children }: { children: ReactNode }) {
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeKey>("brand");

  const currentScheme = colorSchemes[selectedScheme];

  return (
    <BannerThemeContext.Provider value={{ selectedScheme, setSelectedScheme, currentScheme }}>
      {children}
    </BannerThemeContext.Provider>
  );
}

export function useBannerTheme() {
  const context = useContext(BannerThemeContext);
  if (!context) {
    throw new Error("useBannerTheme must be used within a BannerThemeProvider");
  }
  return context;
}
