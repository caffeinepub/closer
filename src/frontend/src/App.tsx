import { Toaster } from "@/components/ui/sonner";
import { Gem, Moon, Sun } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import type { Theme } from "./context/ThemeContext";
import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import LandingPage from "./pages/LandingPage";
import ShopBrowser from "./pages/ShopBrowser";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const options: { value: Theme; icon: React.ReactNode }[] = [
    { value: "dark", icon: <Moon className="w-3 h-3" /> },
    { value: "light", icon: <Sun className="w-3 h-3" /> },
    { value: "gold", icon: <Gem className="w-3 h-3" /> },
  ];
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1 bg-card border border-border rounded-full p-1 shadow-lg">
      {options.map(({ value, icon }) => (
        <button
          type="button"
          key={value}
          onClick={() => setTheme(value)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={`${value} theme`}
          data-ocid={`app.${value}_theme_toggle`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function Router() {
  const { page } = useAuth();

  return (
    <>
      <ThemeSwitcher />
      {page === "landing" && <LandingPage />}
      {page === "auth" && <AuthPage />}
      {page === "customer" && <CustomerDashboard />}
      {page === "shop-browser" && <ShopBrowser />}
      {page === "shop-owner" && <ShopOwnerDashboard />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
