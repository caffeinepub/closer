import { c as createLucideIcon, u as useMyOrders, a as useAllShops, b as useAllProducts, j as jsxRuntimeExports, S as Skeleton, C as ClipboardList, d as useUpdatePaymentProof, e as useUpdatePaymentNote, r as reactExports, B as Button, f as ue } from "./index-Ddbgp5OK.js";
import { T as Textarea } from "./textarea-CRejPQpf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const STATUS_CONFIG = {
  pending: { label: "Inasubiri", icon: Clock, color: "hsl(45,90%,55%)" },
  confirmed: {
    label: "Imethibitishwa",
    icon: CircleCheckBig,
    color: "hsl(120,50%,45%)"
  },
  delivered: {
    label: "Imetolewa",
    icon: CircleCheckBig,
    color: "hsl(200,70%,50%)"
  },
  cancelled: { label: "Imeghairiwa", icon: CircleX, color: "hsl(0,70%,50%)" }
};
function OrderCard({
  order,
  shopName,
  productName,
  shop
}) {
  const uploadProof = useUpdatePaymentProof();
  const updateNote = useUpdatePaymentNote();
  const fileRef = reactExports.useRef(null);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const [noteText, setNoteText] = reactExports.useState("");
  const [showNoteInput, setShowNoteInput] = reactExports.useState(false);
  const handleFile = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    uploadProof.mutate(
      { orderId: order.id, file, paymentNote: "" },
      {
        onSuccess: () => ue.success("Uthibitisho umepakiwa!"),
        onError: () => ue.error("Hitilafu — jaribu tena")
      }
    );
  };
  const handleNoteSubmit = () => {
    if (!noteText.trim()) return;
    updateNote.mutate(
      { orderId: order.id, paymentNote: noteText.trim() },
      {
        onSuccess: () => {
          ue.success("Ujumbe wako umehifadhiwa!");
          setNoteText("");
          setShowNoteInput(false);
        },
        onError: () => ue.error("Hitilafu — jaribu tena")
      }
    );
  };
  const commission = Number(order.commissionAmount);
  const total = Number(order.totalPrice);
  const needsPayment = order.paymentStatus !== "confirmed" && order.status !== "cancelled";
  const isPending = uploadProof.isPending || updateNote.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-4 border space-y-3",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-semibold text-sm",
                style: { color: "hsl(var(--card-foreground))" },
                children: productName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs mt-0.5",
                style: { color: "hsl(var(--muted-foreground))" },
                children: shopName
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", style: { color: cfg.color }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: cfg.label })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center",
              style: { background: "hsl(var(--muted))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "hsl(var(--muted-foreground))" }, children: "Idadi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-semibold",
                    style: { color: "hsl(var(--foreground))" },
                    children: Number(order.quantity)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center",
              style: { background: "hsl(var(--muted))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "hsl(var(--muted-foreground))" }, children: "Jumla" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "font-semibold",
                    style: { color: "hsl(var(--foreground))" },
                    children: [
                      "TZS ",
                      total.toLocaleString()
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-2 text-center",
              style: { background: "hsl(var(--muted))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "hsl(var(--muted-foreground))" }, children: "Komisho" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold", style: { color: "hsl(45,90%,55%)" }, children: [
                  "TZS ",
                  commission.toLocaleString()
                ] })
              ]
            }
          )
        ] }),
        needsPayment && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl p-3 space-y-3 border",
            style: {
              background: "hsl(45,90%,55% / 0.08)",
              borderColor: "hsl(45,90%,55% / 0.3)"
            },
            "data-ocid": "orders.payment.panel",
            children: [
              (shop == null ? void 0 : shop.paymentNumbers) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs font-bold mb-1",
                    style: { color: "hsl(45,90%,45%)" },
                    children: "💳 Lipa Hapa / Pay Here"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "hsl(var(--foreground))" },
                    children: shop.paymentNumbers
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs mt-1",
                    style: { color: "hsl(var(--muted-foreground))" },
                    children: [
                      "Kiasi: TZS ",
                      total.toLocaleString()
                    ]
                  }
                )
              ] }),
              order.paymentProof ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "hsl(120,50%,45%)" }, children: "✓ Uthibitisho wa picha umepakiwa" }) : null,
              order.paymentNote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs rounded-lg px-2 py-1",
                  style: {
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--foreground))"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "hsl(var(--muted-foreground))" }, children: [
                      "Ujumbe:",
                      " "
                    ] }),
                    order.paymentNote
                  ]
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleFile
                }
              ),
              !showNoteInput ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => {
                      var _a;
                      return (_a = fileRef.current) == null ? void 0 : _a.click();
                    },
                    disabled: isPending,
                    "data-ocid": "orders.upload.upload_button",
                    className: "flex-1 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13, className: "mr-1" }),
                      "Pakia Picha"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => setShowNoteInput(true),
                    "data-ocid": "orders.note.secondary_button",
                    className: "flex-1 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 13, className: "mr-1" }),
                      "Andika Ujumbe"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: noteText,
                    onChange: (e) => setNoteText(e.target.value),
                    placeholder: "Mfano: Nilituma TZS 5,000 via M-Pesa ref: ABC123",
                    rows: 2,
                    className: "text-xs",
                    "data-ocid": "orders.note.textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: () => setShowNoteInput(false),
                      "data-ocid": "orders.note.cancel_button",
                      className: "flex-1 text-xs",
                      children: "Ghairi"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      onClick: handleNoteSubmit,
                      disabled: isPending || !noteText.trim(),
                      "data-ocid": "orders.note.submit_button",
                      className: "flex-1 text-xs",
                      style: {
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))"
                      },
                      children: updateNote.isPending ? "Inatuma..." : "Tuma Ujumbe"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        order.paymentStatus === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 text-xs rounded-lg px-2 py-1",
            style: {
              background: "hsl(120,50%,45% / 0.12)",
              color: "hsl(120,50%,35%)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Malipo yamethibitishwa" })
            ]
          }
        )
      ]
    }
  );
}
function CustomerDashboard() {
  const { data: orders, isLoading } = useMyOrders();
  const { data: shops } = useAllShops();
  const { data: products } = useAllProducts();
  const getShop = (shopId) => shops == null ? void 0 : shops.find((s) => s.id === shopId);
  const getShopName = (shopId) => {
    var _a;
    return ((_a = getShop(shopId)) == null ? void 0 : _a.name) || `Duka #${shopId}`;
  };
  const getProductName = (productId) => {
    var _a;
    return ((_a = products == null ? void 0 : products.find((p) => p.id === productId)) == null ? void 0 : _a.name) || `Bidhaa #${productId}`;
  };
  const grouped = {
    active: (orders || []).filter(
      (o) => ["pending", "confirmed"].includes(o.status)
    ),
    delivered: (orders || []).filter((o) => o.status === "delivered"),
    cancelled: (orders || []).filter((o) => o.status === "cancelled")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "hsl(var(--background))" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pt-4 pb-3 sticky top-0 z-10",
            style: {
              background: "hsl(var(--background))",
              borderBottom: "1px solid hsl(var(--border))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-xl font-bold",
                  style: { color: "hsl(var(--foreground))" },
                  children: "Maagizo Yangu"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-sm mt-0.5",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: [
                    (orders == null ? void 0 : orders.length) || 0,
                    " maagizo yote"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-20", children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-32 rounded-xl",
            "data-ocid": "orders.loading_state"
          },
          i
        )) : (orders || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16",
            "data-ocid": "orders.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipboardList,
                {
                  size: 40,
                  style: { color: "hsl(var(--muted-foreground))" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "mt-3 text-sm",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: "Bado hujafanya agizo lolote"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          grouped.active.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs font-semibold uppercase tracking-wide mb-2",
                style: { color: "hsl(var(--muted-foreground))" },
                children: [
                  "Yanayoendelea (",
                  grouped.active.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.active.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shop: getShop(o.shopId)
              },
              o.id.toString()
            )) })
          ] }),
          grouped.delivered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs font-semibold uppercase tracking-wide mb-2",
                style: { color: "hsl(var(--muted-foreground))" },
                children: [
                  "Zilizotolewa (",
                  grouped.delivered.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.delivered.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shop: getShop(o.shopId)
              },
              o.id.toString()
            )) })
          ] }),
          grouped.cancelled.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs font-semibold uppercase tracking-wide mb-2",
                style: { color: "hsl(var(--muted-foreground))" },
                children: [
                  "Zilizoghairiwa (",
                  grouped.cancelled.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.cancelled.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shop: getShop(o.shopId)
              },
              o.id.toString()
            )) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  CustomerDashboard
};
