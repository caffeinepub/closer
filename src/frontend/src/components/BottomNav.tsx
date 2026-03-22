import { Briefcase, ClipboardList, Shield, ShoppingBag } from "lucide-react";

export type Page = "browser" | "orders" | "office" | "admin";

interface BottomNavProps {
  current: Page;
  onChange: (p: Page) => void;
  isAdmin?: boolean;
}

export function BottomNav({ current, onChange, isAdmin }: BottomNavProps) {
  const items = [
    { id: "browser" as Page, label: "Soko", icon: ShoppingBag },
    { id: "orders" as Page, label: "Maagizo", icon: ClipboardList },
    { id: "office" as Page, label: "Ofisi Yangu", icon: Briefcase, gold: true },
    ...(isAdmin
      ? [{ id: "admin" as Page, label: "Admin", icon: Shield, admin: true }]
      : []),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border"
      style={{ background: "hsl(var(--card))" }}
      data-ocid="bottom_nav.panel"
    >
      {items.map(({ id, label, icon: Icon, gold, admin }) => {
        const active = current === id;
        const color = admin
          ? active
            ? "hsl(200,80%,60%)"
            : "hsl(200,60%,50%)"
          : gold
            ? active
              ? "hsl(45,90%,60%)"
              : "hsl(45,70%,50%)"
            : active
              ? "hsl(var(--primary))"
              : "hsl(var(--muted-foreground))";
        return (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            data-ocid={`nav.${id}.link`}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 px-1 text-xs font-medium transition-colors"
            style={{ color }}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              style={{ color }}
            />
            <span style={{ color }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
