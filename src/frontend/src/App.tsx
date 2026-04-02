import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { AiAssistant } from "./components/AiAssistant";
import { BottomNav, type Page } from "./components/BottomNav";
import { ThemeProvider } from "./context/ThemeContext";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin, useMyProfile } from "./hooks/useQueries";
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
const AdminPanel = lazy(() =>
  import("./pages/AdminPanel").then((m) => ({ default: m.AdminPanel })),
);

const PAGE_KEY = "ctm_last_page";

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
  const { actor } = useActor();
  const qc = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: isAdmin } = useIsAdmin();

  // Restore last visited page from localStorage
  const savedPage = (localStorage.getItem(PAGE_KEY) as Page) || "browser";
  const validPages: Page[] = ["browser", "orders", "office", "admin"];
  const initialPage = validPages.includes(savedPage) ? savedPage : "browser";

  const [page, setPage] = useState<Page>(initialPage);
  const [mounted, setMounted] = useState<Set<Page>>(
    new Set([initialPage, "browser"]),
  );

  // Persist page changes to localStorage
  const handleSetPage = useCallback((p: Page) => {
    setPage(p);
    localStorage.setItem(PAGE_KEY, p);
  }, []);

  // After login, always refresh admin status from backend (no cache).
  const autoClaimDone = useRef(false);
  useEffect(() => {
    if (!actor || !isLoggedIn || autoClaimDone.current) return;
    autoClaimDone.current = true;
    (async () => {
      try {
        // Always re-check admin status from backend after login
        await qc.invalidateQueries({ queryKey: ["isAdmin"] });
        await qc.refetchQueries({ queryKey: ["isAdmin"] });
        const alreadyAdmin = await actor.isCallerAdmin();
        if (alreadyAdmin) {
          return;
        }
        // Try to claim admin if no admin exists yet
        const claimed = await actor.claimAdminIfNoneYet();
        if (claimed) {
          await qc.invalidateQueries({ queryKey: ["isAdmin"] });
          await qc.refetchQueries({ queryKey: ["isAdmin"] });
          toast.success("✅ Umepata haki za Admin!", { duration: 5000 });
        }
      } catch {
        // not critical
      }
    })();
  }, [actor, isLoggedIn, qc]);

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

  // If admin page was saved but user lost admin status, fall back to browser
  useEffect(() => {
    if (page === "admin" && isAdmin === false) {
      handleSetPage("browser");
    }
  }, [isAdmin, page, handleSetPage]);

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
          {isAdmin && mounted.has("admin") && (
            <div
              style={{
                display: page === "admin" ? "flex" : "none",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <AdminPanel />
            </div>
          )}
        </Suspense>
      </main>
      <BottomNav current={page} onChange={handleSetPage} isAdmin={!!isAdmin} />
      <AiAssistant />
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
