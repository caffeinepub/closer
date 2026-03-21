import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "dark" | "light" | "gold";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("closer-theme") as Theme) || "dark";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("closer-theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
