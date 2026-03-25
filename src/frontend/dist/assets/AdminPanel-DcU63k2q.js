import { c as createLucideIcon, af as useAppSettings, ag as useAllOrdersAdmin, ah as useUpdateAppSettings, r as reactExports, j as jsxRuntimeExports, ai as ShoppingBag, B as Button, S as Skeleton, l as ue } from "./index-BB7quKFI.js";
import { B as Badge } from "./badge-tyr_jEzy.js";
import { I as Input } from "./input-BlYIFoAe.js";
import { L as Label } from "./label-rzk8Wr5K.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-D_ARQazP.js";
import { L as LoaderCircle } from "./loader-circle-Du7YmDWP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
function formatTZS(amount) {
  return `TZS ${Number(amount).toLocaleString()}`;
}
function PaymentStatusBadge({ status }) {
  const s = status.toLowerCase();
  if (s === "paid" || s === "imelipwa") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        style: { background: "hsl(142,50%,40%)", color: "#fff" },
        "data-ocid": "admin.transaction.paid_status",
        children: "✅ Imelipwa"
      }
    );
  }
  if (s === "pending" || s === "inasubiri") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        style: { background: "hsl(45,90%,45%)", color: "#fff" },
        "data-ocid": "admin.transaction.pending_status",
        children: "⏳ Inasubiri"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      style: {
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))"
      },
      "data-ocid": "admin.transaction.unpaid_status",
      children: "❌ Haijalipiwa"
    }
  );
}
function TransactionRow({ order, idx }) {
  const customerName = order.customerName || "";
  const customerPhone = order.customerPhone || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border p-3 space-y-2",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      "data-ocid": `admin.transaction.item.${idx + 1}`,
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
                  customerName || "(Jina halijawekwa)"
                ]
              }
            ),
            customerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs",
                style: { color: "hsl(var(--muted-foreground))" },
                children: [
                  "📞 ",
                  customerPhone
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: order.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between text-xs",
            style: { color: "hsl(var(--muted-foreground))" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Agizo #",
                order.id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-bold text-sm",
                  style: { color: "hsl(var(--primary))" },
                  children: formatTZS(order.totalPrice)
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-xs",
            style: { color: "hsl(var(--muted-foreground))" },
            children: [
              "Idadi: ",
              Number(order.quantity)
            ]
          }
        )
      ]
    }
  );
}
function AdminPanel() {
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings
  } = useAppSettings();
  const {
    data: allOrders,
    isLoading: ordersLoading,
    refetch: refetchOrders
  } = useAllOrdersAdmin();
  const updateSettings = useUpdateAppSettings();
  const [paymentNumber, setPaymentNumber] = reactExports.useState("");
  const [editingPayment, setEditingPayment] = reactExports.useState(false);
  const handleSaveSettings = () => {
    if (!paymentNumber.trim()) {
      ue.error("Ingiza namba ya malipo");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 overflow-y-auto pb-24",
      style: { background: "hsl(var(--background))" },
      "data-ocid": "admin.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              className: "text-xl font-bold mb-1",
              style: { color: "hsl(var(--foreground))" },
              children: "🛡️ Admin Panel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs",
              style: { color: "hsl(var(--muted-foreground))" },
              children: "Usimamizi wa App / App Management"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "transactions", "data-ocid": "admin.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "transactions",
                className: "flex-1 flex items-center gap-2",
                "data-ocid": "admin.transactions.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14 }),
                  "Maagizo",
                  allOrders && allOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "ml-1 text-xs px-1.5 py-0 h-5",
                      style: {
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))"
                      },
                      children: allOrders.length
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "settings",
                className: "flex-1 flex items-center gap-2",
                "data-ocid": "admin.settings.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14 }),
                  "Mipangilio"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsContent,
            {
              value: "transactions",
              "data-ocid": "admin.transactions.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        className: "font-bold text-base",
                        style: { color: "hsl(var(--foreground))" },
                        children: "Maagizo Yote / All Orders"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "hsl(var(--muted-foreground))" },
                        children: "Orodha ya maagizo na wateja"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => refetchOrders(),
                      "data-ocid": "admin.transactions.refresh_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1" }),
                        "Onyesha upya"
                      ]
                    }
                  )
                ] }),
                ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Skeleton,
                  {
                    className: "h-24 rounded-xl",
                    "data-ocid": "admin.transactions.loading_state"
                  },
                  i
                )) }) : !allOrders || allOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-center py-16",
                    "data-ocid": "admin.transactions.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ShoppingBag,
                        {
                          size: 36,
                          className: "mx-auto mb-3",
                          style: { color: "hsl(var(--muted-foreground))" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm",
                          style: { color: "hsl(var(--muted-foreground))" },
                          children: "Hakuna maagizo bado"
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: allOrders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TransactionRow,
                  {
                    order,
                    idx: i
                  },
                  order.id.toString()
                )) })
              ]
            }
          ),
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
                      children: "Mipangilio ya App / App Settings"
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
                        "data-ocid": "admin.payment_number.input",
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
                        "data-ocid": "admin.payment_number.save_button",
                        children: updateSettings.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Hifadhi"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setEditingPayment(false),
                        "data-ocid": "admin.payment_number.cancel_button",
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
                        "data-ocid": "admin.payment_number.edit_button",
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
