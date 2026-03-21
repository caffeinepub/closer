import { Button } from "@/components/ui/button";
import {
  Bell,
  MapPin,
  Palette,
  Shield,
  ShoppingBag,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import type { Theme } from "../context/ThemeContext";

const features = [
  {
    icon: ShoppingBag,
    title: "Smart Shopping",
    desc: "Browse local stores, search products, place orders in seconds.",
  },
  {
    icon: Store,
    title: "Shop Management",
    desc: "Full dashboard for shop owners — products, orders, social links.",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    desc: "Find shops within 10 km. See exact distances in meters or km.",
  },
  {
    icon: Bell,
    title: "Live Notifications",
    desc: "Sound alerts for new orders, even in the background.",
  },
  {
    icon: Shield,
    title: "10% Commission",
    desc: "Platform earns 10% per order. Transparent breakdown on every sale.",
  },
  {
    icon: Palette,
    title: "3 Themes",
    desc: "Dark, Light, or Gold — switch anytime from any screen.",
  },
];

export default function LandingPage() {
  const { setPage } = useAuth();
  const { theme, setTheme } = useTheme();
  const themes: Theme[] = ["dark", "light", "gold"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="font-display text-2xl font-extrabold gold-text tracking-widest">
          CLOSER
        </span>
        <div className="flex items-center gap-3">
          {themes.map((t) => (
            <button
              type="button"
              key={t}
              data-ocid={`landing.${t}_toggle`}
              onClick={() => setTheme(t)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                theme === t ? "border-primary scale-110" : "border-border"
              } ${
                t === "dark"
                  ? "bg-[#0F0F10]"
                  : t === "light"
                    ? "bg-[#F5F5F5]"
                    : "bg-[#D4AF5A]"
              }`}
              title={`${t} theme`}
            />
          ))}
          <Button
            data-ocid="landing.signin_button"
            onClick={() => setPage("auth")}
            className="rounded-full px-6 font-semibold"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight leading-none"
          >
            The Marketplace
            <br />
            <span className="gold-text">Built for You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            Connect with local shops, order products nearby, and manage your
            store — all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Button
              data-ocid="landing.get_started_button"
              size="lg"
              className="rounded-full px-10 font-bold text-base"
              onClick={() => setPage("auth")}
            >
              Get Started
            </Button>
            <Button
              data-ocid="landing.browse_shops_button"
              size="lg"
              variant="outline"
              className="rounded-full px-10 font-bold text-base gold-border gold-text"
              onClick={() => setPage("shop-browser")}
            >
              Browse Shops
            </Button>
          </motion.div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors"
              >
                <f.icon className="w-8 h-8 mb-3 gold-text" />
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground text-sm border-t border-border">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="gold-text hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
