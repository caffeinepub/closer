import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect, useState } from "react";
import { BottomNav, type Page } from "./components/BottomNav";
import { ThemeProvider } from "./context/ThemeContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useMyProfile } from "./hooks/useQueries";
import { LandingPage } from "./pages/LandingPage";

const CustomerDashboard = lazy(() =>
  import("./pages/CustomerDashboard").then((m) => ({
    default: m.CustomerDashboard,
  })),
);
const ShopBrowser = lazy(() =>
  import("./pages/ShopBrowser").then((m) => ({ default: m.ShopBrowser })),
);
const ShopOwnerDashboard = lazy(() =>
  import("./pages/ShopOwnerDashboard").then((m) => ({
    default: m.ShopOwnerDashboard,
  })),
);
const ProfileSetup = lazy(() =>
  import("./pages/ProfileSetup").then((m) => ({ default: m.ProfileSetup })),
);

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="space-y-3 w-48">
        <Skeleton className="h-8 rounded-xl" />
        <Skeleton className="h-4 rounded-xl" />
        <Skeleton className="h-4 w-3/4 rounded-xl" />
      </div>
    </div>
  );
}

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [page, setPage] = useState<Page>("browser");
  // Track which pages have been visited so we only mount them when first needed
  const [mounted, setMounted] = useState<Set<Page>>(new Set(["browser"]));

  const { data: profile, isLoading: profileLoading } = useMyProfile();

  // Mount page on first visit, keep mounted forever after
  useEffect(() => {
    setMounted((prev) => {
      if (prev.has(page)) return prev;
      const next = new Set(prev);
      next.add(page);
      return next;
    });
  }, [page]);

  // Sync theme from profile
  useEffect(() => {
    if (profile?.preferredTheme) {
      const t = profile.preferredTheme;
      if (["dark", "light", "gold"].includes(t)) {
        localStorage.setItem("closer-theme", t);
        document.documentElement.setAttribute("data-theme", t);
      }
    }
  }, [profile]);

  if (isInitializing) {
    return <PageLoader />;
  }

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  if (profileLoading) {
    return <PageLoader />;
  }

  if (profile === null) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProfileSetup />
      </Suspense>
    );
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      <main className="flex-1 overflow-hidden relative">
        <Suspense fallback={<PageLoader />}>
          {/* Keep all visited pages mounted - just hide them with CSS */}
          {mounted.has("browser") && (
            <div
              style={{
                display: page === "browser" ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <ShopBrowser />
            </div>
          )}
          {mounted.has("orders") && (
            <div
              style={{
                display: page === "orders" ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <CustomerDashboard />
            </div>
          )}
          {mounted.has("office") && (
            <div
              style={{
                display: page === "office" ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <ShopOwnerDashboard />
            </div>
          )}
        </Suspense>
      </main>
      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
      <Toaster />
    </ThemeProvider>
  );
}
