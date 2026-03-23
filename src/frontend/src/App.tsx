import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BottomNav, type Page } from "./components/BottomNav";
import { ThemeProvider } from "./context/ThemeContext";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin, useMyProfile } from "./hooks/useQueries";
import { LandingPage } from "./pages/LandingPage";

// Extract admin token from URL hash once at module level
const _hashMatch = window.location.hash.match(
  /caffeineAdminToken=([a-f0-9A-F]+)/,
);
const ADMIN_TOKEN_FROM_URL: string | null = _hashMatch ? _hashMatch[1] : null;
if (ADMIN_TOKEN_FROM_URL) {
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

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
  const [mounted, setMounted] = useState<Set<Page>>(new Set(["browser"]));
  const { actor } = useActor();
  const qc = useQueryClient();
  const adminClaimDone = useRef(false);

  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: isAdmin } = useIsAdmin();

  // Claim admin rights from URL token using the correct function name
  useEffect(() => {
    if (
      !ADMIN_TOKEN_FROM_URL ||
      !actor ||
      !isLoggedIn ||
      adminClaimDone.current
    )
      return;
    adminClaimDone.current = true;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any)._initializeAccessControlWithSecret(
          ADMIN_TOKEN_FROM_URL,
        );
        const nowAdmin = await actor.isCallerAdmin();
        await qc.invalidateQueries();
        if (nowAdmin) {
          toast.success("✅ Umepata haki za Admin!", { duration: 6000 });
        } else {
          toast.info("Umesajiliwa kama mtumiaji wa kawaida.");
        }
      } catch (e) {
        console.error("Admin claim error:", e);
      }
    })();
  }, [actor, isLoggedIn, qc]);

  // Auto-claim admin for existing registered users if no admin yet.
  // Always verify from backend to avoid stale cache issues.
  const autoClaimDone = useRef(false);
  useEffect(() => {
    if (!actor || !isLoggedIn || autoClaimDone.current) return;
    autoClaimDone.current = true;
    (async () => {
      try {
        // Always verify from backend directly to avoid stale cache issues
        const alreadyAdmin = await actor.isCallerAdmin();
        if (alreadyAdmin) {
          await qc.invalidateQueries({ queryKey: ["isAdmin"] });
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const claimed = await (actor as any).claimAdminIfNoneYet();
        if (claimed) {
          await qc.invalidateQueries();
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
      <BottomNav current={page} onChange={setPage} isAdmin={!!isAdmin} />
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
