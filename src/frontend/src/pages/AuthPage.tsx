import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AuthPage() {
  const { login, loginStatus, isLoggingIn, isLoginError, identity } =
    useInternetIdentity();
  const { actor } = useActor();
  const { setPage, setRole, setProfile, setIsAuthenticated } = useAuth();

  const [step, setStep] = useState<"connect" | "profile">("connect");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleConnect() {
    setPopupBlocked(false);

    // Step 1: Open a blank popup SYNCHRONOUSLY in the click handler.
    // Browsers allow this because we are directly inside a user gesture.
    const preOpened = window.open(
      "about:blank",
      "ii-login-window",
      "width=525,height=705,left=100,top=100,toolbar=0,location=0,menubar=0,resizable=1,scrollbars=1",
    );

    if (!preOpened || preOpened.closed) {
      // Browser blocked even our synchronous open — user must allow popups manually.
      setPopupBlocked(true);
      return;
    }

    // Step 2: Temporarily replace window.open so that when auth-client calls it
    // internally, it gets our already-opened window back instead of trying to
    // open a second one (which would be blocked as non-user-gesture).
    const originalOpen = window.open.bind(window);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).open = (
      url?: string | URL,
      _target?: string,
      _features?: string,
    ) => {
      // Navigate our pre-opened window to the requested URL.
      if (url && preOpened && !preOpened.closed) {
        preOpened.location.href = url.toString();
      }
      return preOpened;
    };

    // Step 3: Restore original window.open after a tick so only auth-client's
    // immediate call is intercepted.
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).open = originalOpen;
    }, 200);

    // Step 4: Call the auth-client login — it will use our intercepted window.open.
    login();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    if (!actor || !name.trim()) return;
    setSaving(true);
    try {
      const principal = identity?.getPrincipal().toString();
      if (principal && avatarPreview) {
        localStorage.setItem(`avatar_${principal}`, avatarPreview);
      }

      // If admin secret provided, initialize access control first
      if (adminSecret.trim()) {
        try {
          await actor._initializeAccessControlWithSecret(adminSecret.trim());
        } catch {
          // Admin secret may already be set or not matching — continue regardless
        }
      }

      await actor.registerProfile(name.trim(), "", email.trim(), "dark");
      const [role, profile] = await Promise.all([
        actor.getCallerUserRole(),
        actor.getMyProfile(),
      ]);
      setRole(role);
      if (profile) setProfile(profile);
      setIsAuthenticated(true);
      if (role === UserRole.admin) {
        setPage("shop-owner");
      } else {
        setPage("customer");
      }
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // When II login succeeds, move to profile step
  if (loginStatus === "success" && step === "connect") {
    setStep("profile");
  }

  const showError = isLoginError || popupBlocked;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 flex flex-col gap-6"
        data-ocid="auth.modal"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold gold-text tracking-widest">
            CLOSER
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your Local Marketplace
          </p>
        </div>

        {step === "connect" ? (
          <div className="flex flex-col gap-4">
            <p className="text-center text-foreground font-medium">
              Connect your identity to continue
            </p>

            {showError ? (
              <div
                className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex flex-col gap-3"
                data-ocid="auth.login_error_state"
              >
                <p className="text-destructive text-sm font-semibold text-center">
                  🚫 Login window was blocked
                </p>
                <p className="text-destructive/80 text-xs text-center">
                  Your browser is blocking popups. Allow popups for this site
                  then tap Retry Login.
                </p>

                <Button
                  data-ocid="auth.login_button"
                  size="lg"
                  className="rounded-full font-bold w-full"
                  onClick={handleConnect}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoggingIn ? "Connecting..." : "🔄 Retry Login"}
                </Button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-1 text-xs text-destructive/70 hover:text-destructive transition-colors mx-auto"
                  onClick={() => setShowInstructions((v) => !v)}
                >
                  {showInstructions ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {showInstructions
                    ? "Hide instructions"
                    : "How to allow popups"}
                </button>

                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2 text-xs text-foreground/80"
                  >
                    <div className="bg-background/60 rounded-lg p-2">
                      <p className="font-semibold mb-1">🌐 Chrome / Edge</p>
                      <p>
                        Tap the blocked popup icon (🚫) in the address bar →
                        &quot;Always allow popups from this site&quot; → Done.
                      </p>
                    </div>
                    <div className="bg-background/60 rounded-lg p-2">
                      <p className="font-semibold mb-1">🦊 Firefox</p>
                      <p>
                        Click the blocked bar at the top → &quot;Allow popups
                        for this site&quot;.
                      </p>
                    </div>
                    <div className="bg-background/60 rounded-lg p-2">
                      <p className="font-semibold mb-1">🧭 Safari</p>
                      <p>
                        Safari → Settings → Websites → Pop-up Windows → set this
                        site to &quot;Allow&quot;.
                      </p>
                    </div>
                    <div className="bg-background/60 rounded-lg p-2">
                      <p className="font-semibold mb-1">📱 Samsung Browser</p>
                      <p>
                        ⋮ Menu → Settings → Sites and downloads → Block pop-ups
                        → turn OFF, then retry.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button
                data-ocid="auth.login_button"
                size="lg"
                className="rounded-full font-bold"
                onClick={handleConnect}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
              </Button>
            )}

            <Button
              data-ocid="auth.guest_button"
              variant="outline"
              className="rounded-full gold-border gold-text"
              onClick={() => {
                setIsAuthenticated(false);
                setRole(UserRole.guest);
                setPage("shop-browser");
              }}
            >
              Browse as Guest
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
                data-ocid="auth.avatar_upload_button"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-7 h-7 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
              <span className="text-xs text-muted-foreground">
                Tap to add profile photo
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                data-ocid="auth.avatar_file_input"
              />
            </div>

            <p className="text-muted-foreground text-sm text-center">
              Welcome! Principal:{" "}
              <span className="gold-text text-xs">
                {identity?.getPrincipal().toString().slice(0, 16)}...
              </span>
            </p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                data-ocid="auth.name_input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                data-ocid="auth.email_input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="adminSecret">
                Neno la Siri (Admin tu) / Admin Secret (optional)
              </Label>
              <Input
                id="adminSecret"
                type="password"
                data-ocid="auth.admin_secret_input"
                placeholder="Admin secret key..."
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Kama una neno la siri la admin, ingiza hapa / If you have the
                admin secret, enter it here
              </p>
            </div>
            <Button
              data-ocid="auth.submit_button"
              size="lg"
              className="rounded-full font-bold"
              onClick={handleSaveProfile}
              disabled={saving || !name.trim()}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {saving ? "Saving..." : "Enter Marketplace"}
            </Button>
          </div>
        )}

        <button
          type="button"
          data-ocid="auth.back_button"
          onClick={() => setPage("landing")}
          className="text-muted-foreground text-xs text-center hover:text-foreground transition-colors"
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
}
