import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsConditions } from "./TermsConditions";

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1565C0, #6A1B9A, #FF00AA)",
          }}
        >
          <img
            src="/assets/generated/app-icon.dim_512x512.png"
            alt="Closer to Market"
            className="w-full h-full object-cover"
          />
        </div>

        <h1
          className="text-4xl font-bold mb-1 tracking-tight"
          style={{
            background: "linear-gradient(135deg, #C2185B, #FF00AA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Closer
        </h1>
        <p
          className="text-base font-semibold mb-2"
          style={{ color: "#E91E8C" }}
        >
          to Market
        </p>
        <p
          className="text-sm mb-2"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Soko lako karibu nawe
        </p>
        <p
          className="text-sm max-w-xs mb-10 leading-relaxed"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Gundua maduka yaliyo karibu nawe, agiza bidhaa, na fuatilia malipo
          &mdash; yote mahali pamoja.
        </p>

        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="landing.login.primary_button"
          size="lg"
          className="w-full max-w-xs text-base font-semibold py-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #C2185B, #FF00AA)",
            color: "#fff",
            border: "none",
          }}
        >
          {isLoggingIn ? "Inaingiza..." : "Ingia / Jiandikishe"}
        </Button>

        <p
          className="mt-4 text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Hakuna akaunti inayohitajika &mdash; tumia Internet Identity
        </p>
      </div>

      {/* Features */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-4 max-w-sm mx-auto w-full">
        {[
          { icon: MapPin, label: "Maduka karibu" },
          { icon: ShoppingBag, label: "Agiza haraka" },
          { icon: Star, label: "Duka lako" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: "hsl(var(--card))" }}
          >
            <Icon size={20} style={{ color: "#E91E8C" }} />
            <span
              className="text-xs text-center font-medium"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className="text-center pb-6 px-4 text-xs space-y-2"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline hover:opacity-80 transition"
            style={{ color: "#E91E8C" }}
          >
            Masharti ya Matumizi
          </button>
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="underline hover:opacity-80 transition"
            style={{ color: "#E91E8C" }}
          >
            Sera ya Faragha
          </button>
        </div>
        <div>
          &copy; {new Date().getFullYear()}. Built with &#10084;&#65039; using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#E91E8C" }}
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      <TermsConditions open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}
