import { Briefcase, ClipboardList, ShoppingBag } from "lucide-react";

export type Page = "browser" | "orders" | "office" | "profile";

interface BottomNavProps {
  current: Page;
  onChange: (p: Page) => void;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  const items = [
    { id: "browser" as Page, label: "Soko", icon: ShoppingBag },
    { id: "orders" as Page, label: "Maagizo", icon: ClipboardList },
    { id: "office" as Page, label: "Ofisi Yangu", icon: Briefcase, gold: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border"
      style={{ background: "hsl(var(--card))" }}
      data-ocid="bottom_nav.panel"
    >
      {items.map(({ id, label, icon: Icon, gold }) => {
        const active = current === id;
        return (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            data-ocid={`nav.${id}.link`}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 px-1 text-xs font-medium transition-colors"
            style={{
              color: gold
                ? active
                  ? "hsl(45,90%,60%)"
                  : "hsl(45,80%,55%)"
                : active
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
            }}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              style={{
                color: gold
                  ? active
                    ? "hsl(45,90%,60%)"
                    : "hsl(45,70%,50%)"
                  : undefined,
              }}
            />
            <span
              style={
                gold
                  ? { color: active ? "hsl(45,90%,60%)" : "hsl(45,70%,50%)" }
                  : {}
              }
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
