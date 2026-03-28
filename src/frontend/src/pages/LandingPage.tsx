import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { PrivacyPolicy } from "./PrivacyPolicy";

interface AppFeedback {
  id: bigint;
  userId: unknown;
  userName: string;
  rating: bigint;
  comment: string;
  timestamp: bigint;
}
import { TermsConditions } from "./TermsConditions";

const STAR_INDICES = [0, 1, 2, 3, 4];

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {STAR_INDICES.map((i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? "#FBBF24" : "none"}
          stroke={i < Math.round(rating) ? "#FBBF24" : "#9CA3AF"}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          data-ocid={`feedback.star.${n}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            size={28}
            fill={(hover || value) >= n ? "#FBBF24" : "none"}
            stroke={(hover || value) >= n ? "#FBBF24" : "#9CA3AF"}
          />
        </button>
      ))}
    </span>
  );
}

function FeedbackSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { actor } = useActor();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    (async () => {
      try {
        const [fbList, avgResult] = await Promise.all([
          (actor as any).getAppFeedbacks(),
          (actor as any).getAverageRating(),
        ]);
        if (!cancelled) {
          setFeedbacks(fbList);
          setAvgRating(Number(avgResult[0]) / 10);
          setTotalCount(Number(avgResult[1]));
        }
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) setLoadingFeedbacks(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor]);

  const refreshFeedbacks = async () => {
    if (!actor) return;
    try {
      const [fbList, avgResult] = await Promise.all([
        (actor as any).getAppFeedbacks(),
        (actor as any).getAverageRating(),
      ]);
      setFeedbacks(fbList);
      setAvgRating(Number(avgResult[0]) / 10);
      setTotalCount(Number(avgResult[1]));
    } catch {
      // silently ignore
    }
  };

  const handleSubmit = async () => {
    if (!actor || rating === 0 || !comment.trim()) return;
    setSubmitting(true);
    try {
      await (actor as any).submitAppFeedback(BigInt(rating), comment.trim());
      setSubmitted(true);
      setRating(0);
      setComment("");
      await refreshFeedbacks();
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // silently ignore
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (ns: bigint) => {
    const ms = Number(ns / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString("sw-TZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const recent = feedbacks.slice(-5).reverse();

  return (
    <section
      className="px-4 pb-8 max-w-sm mx-auto w-full"
      data-ocid="feedback.section"
    >
      <h2
        className="text-lg font-bold mb-4 text-center"
        style={{ color: "#E91E8C" }}
      >
        ⭐ Maoni &amp; Ukadiriaji
      </h2>

      {/* Average rating card */}
      <div
        className="rounded-xl p-4 mb-4 flex flex-col items-center gap-2"
        style={{ background: "hsl(var(--card))" }}
      >
        {loadingFeedbacks ? (
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: "#E91E8C" }}
          />
        ) : (
          <>
            <StarDisplay rating={avgRating} size={24} />
            <p className="text-2xl font-bold" style={{ color: "#E91E8C" }}>
              {totalCount > 0 ? avgRating.toFixed(1) : "\u2014"}
              <span
                className="text-sm font-normal"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {" "}
                / 5
              </span>
            </p>
            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {totalCount} maoni
            </p>
          </>
        )}
      </div>

      {/* Feedback form */}
      {isLoggedIn && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "hsl(var(--card))" }}
          data-ocid="feedback.panel"
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Toa Maoni Yako
          </p>
          <div className="mb-3">
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <Textarea
            data-ocid="feedback.textarea"
            placeholder="Andika maoni yako..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3 text-sm resize-none"
            rows={3}
          />
          {submitted && (
            <p
              className="text-xs mb-2 font-medium"
              style={{ color: "#22C55E" }}
              data-ocid="feedback.success_state"
            >
              ✅ Maoni yako yamepokewa. Asante!
            </p>
          )}
          <Button
            data-ocid="feedback.submit_button"
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || !comment.trim()}
            size="sm"
            className="w-full font-semibold"
            style={{
              background: "linear-gradient(135deg, #C2185B, #FF00AA)",
              color: "#fff",
              border: "none",
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Inatuma...
              </>
            ) : (
              "Tuma Maoni"
            )}
          </Button>
        </div>
      )}

      {/* Recent feedbacks */}
      {recent.length > 0 && (
        <div className="space-y-3" data-ocid="feedback.list">
          <p
            className="text-xs font-semibold"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Maoni ya Hivi Karibuni
          </p>
          {recent.map((fb, idx) => (
            <div
              key={String(fb.id)}
              className="rounded-xl p-3"
              style={{ background: "hsl(var(--card))" }}
              data-ocid={`feedback.item.${idx + 1}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {fb.userName || "Mtumiaji"}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {formatDate(fb.timestamp)}
                </span>
              </div>
              <StarDisplay rating={Number(fb.rating)} size={13} />
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {fb.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function LandingPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
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

      {/* Feedback & Rating */}
      <FeedbackSection isLoggedIn={identity !== null} />

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
            Caffeine
          </a>
        </div>
      </footer>

      <TermsConditions open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}
