import { c as createLucideIcon, ah as useAllUserProfiles, a as useAllShops, b as useAllProducts, ai as useAllOrdersAdmin, aj as useAppSettings, ak as useUpdateAppSettings, r as reactExports, j as jsxRuntimeExports, al as ShoppingBag, S as Skeleton, B as Button, ag as LoaderCircle, l as ue } from "./index-16JMc85F.js";
import { B as Badge } from "./badge-DQ1IPKeI.js";
import { I as Input } from "./input-Bb-dIfTE.js";
import { L as Label } from "./label-Di6JSKQL.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, S as Store, P as Package, d as TabsContent } from "./tabs-BRePAWWo.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function formatTZS(amount) {
  return `TZS ${Number(amount).toLocaleString()}`;
}
function CountBadge({ count }) {
  if (count === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      className: "ml-1 text-xs px-1.5 py-0 h-5 min-w-5",
      style: {
        background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
        color: "#fff"
      },
      children: count
    }
  );
}
function SectionHeader({
  title,
  subtitle,
  onRefresh
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-bold text-base",
          style: { color: "hsl(var(--foreground))" },
          children: title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs",
          style: { color: "hsl(var(--muted-foreground))" },
          children: subtitle
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onRefresh,
        "data-ocid": "admin.refresh_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1" }),
          "Onyesha upya"
        ]
      }
    )
  ] });
}
function LoadingCards() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) });
}
function EmptyState({
  icon,
  message
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "admin.empty_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center mb-3",
        style: { color: "hsl(var(--muted-foreground))" },
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "hsl(var(--muted-foreground))" }, children: message })
  ] });
}
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "hsl(var(--muted-foreground))" }, children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-medium truncate",
        style: { color: "hsl(var(--foreground))" },
        children: value
      }
    )
  ] });
}
function UserCard({
  entry,
  idx
}) {
  const [, profile] = entry;
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border p-3 flex items-start gap-3",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      "data-ocid": `admin.users.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
            style: {
              background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
              color: "#fff"
            },
            children: initials || "?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-semibold text-sm truncate",
              style: { color: "hsl(var(--foreground))" },
              children: profile.name || "(Jina halijawekwa)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "📞", value: profile.phone || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "✉️", value: profile.email || "—" })
        ] })
      ]
    }
  );
}
function ShopCard({ shop, idx }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border p-3 space-y-1.5",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      "data-ocid": `admin.shops.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "font-semibold text-sm truncate",
              style: { color: "hsl(var(--foreground))" },
              children: [
                "🏪 ",
                shop.name
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            shop.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2 h-2 rounded-full bg-green-500 inline-block",
                title: "Active"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs px-1.5 py-0 h-5",
                style: { color: "hsl(var(--muted-foreground))" },
                children: shop.isActive ? "Wazi" : "Imefungwa"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Kundi", value: shop.category || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Anwani", value: shop.address || "—" })
      ]
    }
  );
}
function ProductCard({ product, idx }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border p-3 space-y-1.5",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      "data-ocid": `admin.products.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "font-semibold text-sm truncate",
              style: { color: "hsl(var(--foreground))" },
              children: [
                "📦 ",
                product.name
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-bold text-sm shrink-0",
              style: { color: "hsl(var(--primary))" },
              children: formatTZS(product.price)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Aina", value: product.category || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Stoo", value: Number(product.stock).toString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Duka #", value: product.shopId.toString() })
      ]
    }
  );
}
function OrderStatusBadge({ status }) {
  const s = status.toLowerCase();
  let bg = "hsl(var(--muted))";
  let color = "hsl(var(--muted-foreground))";
  let label = status;
  if (s === "completed" || s === "imekamilika") {
    bg = "oklch(0.55 0.16 145)";
    color = "#fff";
    label = "✅ Imekamilika";
  } else if (s === "pending" || s === "inasubiri") {
    bg = "oklch(0.72 0.18 75)";
    color = "#fff";
    label = "⏳ Inasubiri";
  } else if (s === "cancelled" || s === "imefutwa") {
    bg = "oklch(0.55 0.22 25)";
    color = "#fff";
    label = "❌ Imefutwa";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { style: { background: bg, color }, className: "text-xs", children: label });
}
function OrderCard({ order, idx }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border p-3 space-y-2",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      "data-ocid": `admin.orders.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-semibold text-sm truncate",
                style: { color: "hsl(var(--foreground))" },
                children: [
                  "👤 ",
                  order.customerName || "(Jina halijawekwa)"
                ]
              }
            ),
            order.customerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs",
                style: { color: "hsl(var(--muted-foreground))" },
                children: [
                  "📞 ",
                  order.customerPhone
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Agizo #", value: order.id.toString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Bidhaa #", value: order.productId.toString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Idadi", value: Number(order.quantity).toString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-bold text-sm",
              style: { color: "hsl(var(--primary))" },
              children: formatTZS(order.totalPrice)
            }
          )
        ] })
      ]
    }
  );
}
function AdminPanel() {
  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers
  } = useAllUserProfiles();
  const {
    data: shops,
    isLoading: shopsLoading,
    refetch: refetchShops
  } = useAllShops();
  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProducts
  } = useAllProducts();
  const {
    data: allOrders,
    isLoading: ordersLoading,
    refetch: refetchOrders
  } = useAllOrdersAdmin();
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings
  } = useAppSettings();
  const updateSettings = useUpdateAppSettings();
  const [paymentNumber, setPaymentNumber] = reactExports.useState("");
  const [editingPayment, setEditingPayment] = reactExports.useState(false);
  const handleSaveSettings = () => {
    if (!paymentNumber.trim()) {
      ue.error("Ingiza namba ya mawasiliano");
      return;
    }
    updateSettings.mutate(paymentNumber.trim(), {
      onSuccess: () => {
        ue.success("Mipangilio imehifadhiwa!");
        setEditingPayment(false);
        refetchSettings();
      },
      onError: () => ue.error("Hitilafu — jaribu tena")
    });
  };
  const userCount = (users == null ? void 0 : users.length) ?? 0;
  const shopCount = (shops == null ? void 0 : shops.length) ?? 0;
  const productCount = (products == null ? void 0 : products.length) ?? 0;
  const orderCount = (allOrders == null ? void 0 : allOrders.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 overflow-y-auto pb-24",
      style: { background: "hsl(var(--background))" },
      "data-ocid": "admin.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pt-6 pb-4",
            style: {
              background: "linear-gradient(135deg, oklch(0.25 0.08 260), oklch(0.2 0.1 310))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold mb-1 text-white", children: "🛡️ Admin Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/70", children: "Usimamizi wa App • Closer to Market" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 mt-4", children: [
                { label: "Watumiaji", value: userCount, emoji: "👥" },
                { label: "Maduka", value: shopCount, emoji: "🏪" },
                { label: "Bidhaa", value: productCount, emoji: "📦" },
                { label: "Maagizo", value: orderCount, emoji: "🛒" }
              ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl p-2 text-center",
                  style: { background: "rgba(255,255,255,0.12)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base", children: stat.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-white leading-none", children: stat.value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/70 mt-0.5 leading-tight", children: stat.label })
                  ]
                },
                stat.label
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "users", "data-ocid": "admin.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4 overflow-x-auto flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "users",
                className: "flex-1 flex items-center gap-1 text-xs",
                "data-ocid": "admin.users.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }),
                  "Watumiaji",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CountBadge, { count: userCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "shops",
                className: "flex-1 flex items-center gap-1 text-xs",
                "data-ocid": "admin.shops.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 13 }),
                  "Maduka",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CountBadge, { count: shopCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "products",
                className: "flex-1 flex items-center gap-1 text-xs",
                "data-ocid": "admin.products.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 13 }),
                  "Bidhaa",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CountBadge, { count: productCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "orders",
                className: "flex-1 flex items-center gap-1 text-xs",
                "data-ocid": "admin.orders.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 13 }),
                  "Maagizo",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CountBadge, { count: orderCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "settings",
                className: "flex-1 flex items-center gap-1 text-xs",
                "data-ocid": "admin.settings.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 13 }),
                  "Mipangilio"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "users", "data-ocid": "admin.users.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Watumiaji Wote",
                subtitle: `Watumiaji ${userCount} wamesajiliwa`,
                onRefresh: refetchUsers
              }
            ),
            usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCards, {}) : !users || users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 36 }),
                message: "Hakuna watumiaji bado"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: users.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserCard, { entry, idx: i }, entry[0].toString())) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "shops", "data-ocid": "admin.shops.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Maduka Yote",
                subtitle: `Maduka ${shopCount} yamesajiliwa`,
                onRefresh: refetchShops
              }
            ),
            shopsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCards, {}) : !shops || shops.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 36 }),
                message: "Hakuna maduka bado"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: shops.map((shop, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShopCard, { shop, idx: i }, shop.id.toString())) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "products", "data-ocid": "admin.products.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Bidhaa Zote",
                subtitle: `Bidhaa ${productCount} zinapatikana`,
                onRefresh: refetchProducts
              }
            ),
            productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCards, {}) : !products || products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 36 }),
                message: "Hakuna bidhaa bado"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductCard,
              {
                product,
                idx: i
              },
              product.id.toString()
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "orders", "data-ocid": "admin.orders.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Maagizo Yote",
                subtitle: `Maagizo ${orderCount} yamewekwa`,
                onRefresh: refetchOrders
              }
            ),
            ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingCards, {}) : !allOrders || allOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 36 }),
                message: "Hakuna maagizo bado"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: allOrders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order, idx: i }, order.id.toString())) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", "data-ocid": "admin.settings.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl p-4 border",
              style: {
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18, style: { color: "hsl(var(--primary))" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "font-bold text-base",
                      style: { color: "hsl(var(--foreground))" },
                      children: "Mipangilio ya App"
                    }
                  )
                ] }),
                settingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: { color: "hsl(var(--foreground))" }, children: "Namba ya Mawasiliano / Contact Number" }),
                  editingPayment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: paymentNumber,
                        onChange: (e) => setPaymentNumber(e.target.value),
                        placeholder: "+255700000000",
                        className: "flex-1",
                        "data-ocid": "admin.settings.input",
                        onKeyDown: (e) => e.key === "Enter" && handleSaveSettings()
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: handleSaveSettings,
                        disabled: updateSettings.isPending,
                        style: {
                          background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
                          color: "#fff"
                        },
                        "data-ocid": "admin.settings.save_button",
                        children: updateSettings.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Hifadhi"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setEditingPayment(false),
                        "data-ocid": "admin.settings.cancel_button",
                        children: "Ghairi"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex-1 px-3 py-2 rounded-lg text-sm",
                        style: {
                          background: "hsl(var(--muted))",
                          color: "hsl(var(--foreground))"
                        },
                        children: (settings == null ? void 0 : settings.platformPaymentNumber) || "Haijawekwa bado"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => {
                          setPaymentNumber(
                            (settings == null ? void 0 : settings.platformPaymentNumber) || ""
                          );
                          setEditingPayment(true);
                        },
                        "data-ocid": "admin.settings.edit_button",
                        children: "Badilisha"
                      }
                    )
                  ] })
                ] }) })
              ]
            }
          ) })
        ] }) })
      ]
    }
  );
}
export {
  AdminPanel
};
