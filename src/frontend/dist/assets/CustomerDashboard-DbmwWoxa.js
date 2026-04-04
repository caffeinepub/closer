import { c as createLucideIcon, u as useMyOrders, a as useAllShops, b as useAllProducts, d as useUpdatePaymentProof, e as useUpdatePaymentNote, j as jsxRuntimeExports, S as Skeleton, C as ClipboardList, r as reactExports, B as Button, L as LoaderCircle, f as ue } from "./index-BbFCZ4lN.js";
import { I as Input } from "./input-CuPvlqhR.js";
import { C as CircleX, a as CircleCheckBig } from "./circle-x-BejeczT-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
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
function PaymentStatusBadge({ paymentStatus }) {
  if (paymentStatus === "confirmed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium",
        style: { background: "hsl(142,60%,94%)", color: "hsl(142,60%,30%)" },
        "data-ocid": "orders.payment.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Malipo yamethibitishwa" })
        ]
      }
    );
  }
  if (paymentStatus === "rejected") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium",
        style: { background: "hsl(0,90%,95%)", color: "hsl(0,70%,40%)" },
        "data-ocid": "orders.payment.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Malipo yamekataliwa — lipa tena" })
        ]
      }
    );
  }
  if (paymentStatus === "pending") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium",
        style: { background: "hsl(45,90%,95%)", color: "hsl(35,80%,35%)" },
        "data-ocid": "orders.payment.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uthibitisho unakaguliwa..." })
        ]
      }
    );
  }
  return null;
}
function OrderCard({
  order,
  shopName,
  productName,
  shopPaymentNumbers,
  uploadProof,
  isUploading
}) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const total = Number(order.totalPrice);
  const [showUpload, setShowUpload] = reactExports.useState(false);
  const [proofNote, setProofNote] = reactExports.useState("");
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const canUpload = order.paymentStatus !== "confirmed" && order.paymentStatus !== "rejected";
  const hasProofPending = order.paymentStatus === "pending" && (order.paymentProof || order.paymentNote);
  const handleSubmitProof = () => {
    if (!selectedFile && !proofNote.trim()) {
      ue.error("Andika maandishi au chagua picha ya uthibitisho");
      return;
    }
    uploadProof(order.id, selectedFile, proofNote);
    setShowUpload(false);
    setSelectedFile(null);
    setProofNote("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-4 space-y-3",
      style: {
        background: "hsl(var(--card))"
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
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
          )
        ] }),
        shopPaymentNumbers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
            style: { background: "hsl(142,60%,94%)", color: "hsl(142,50%,28%)" },
            "data-ocid": "orders.payment.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "💳" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Lipa kwa: ",
                shopPaymentNumbers
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { paymentStatus: order.paymentStatus }),
        canUpload && !hasProofPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: showUpload ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "space-y-2 rounded-xl p-3",
            style: {
              background: "hsl(var(--muted))"
            },
            "data-ocid": "orders.proof.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-semibold",
                  style: { color: "hsl(var(--foreground))" },
                  children: "📎 Tuma Uthibitisho wa Malipo"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: "Pakia picha AU andika maandishi ya uthibitisho"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    var _a;
                    return setSelectedFile(((_a = e.target.files) == null ? void 0 : _a[0]) || null);
                  },
                  "data-ocid": "orders.proof.upload_button"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    return (_a = fileRef.current) == null ? void 0 : _a.click();
                  },
                  className: "w-full rounded-lg border-2 border-dashed py-2 text-xs",
                  style: {
                    borderColor: selectedFile ? "hsl(142,60%,45%)" : "hsl(var(--border))",
                    color: selectedFile ? "hsl(142,60%,35%)" : "hsl(var(--muted-foreground))",
                    background: "hsl(var(--background))"
                  },
                  "data-ocid": "orders.proof.dropzone",
                  children: selectedFile ? `✅ ${selectedFile.name}` : "Gusa kuchagua picha"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: proofNote,
                  onChange: (e) => setProofNote(e.target.value),
                  placeholder: "Nambari ya muamala, neno la uthibitisho...",
                  className: "text-xs h-8",
                  "data-ocid": "orders.proof.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "flex-1 text-xs h-8",
                    onClick: handleSubmitProof,
                    disabled: isUploading || !selectedFile && !proofNote.trim(),
                    style: {
                      background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
                      color: "#fff"
                    },
                    "data-ocid": "orders.proof.submit_button",
                    children: [
                      isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin mr-1" }) : null,
                      "Tuma"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "text-xs h-8",
                    onClick: () => {
                      setShowUpload(false);
                      setSelectedFile(null);
                      setProofNote("");
                    },
                    "data-ocid": "orders.proof.cancel_button",
                    children: "Ghairi"
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "w-full text-xs h-8 gap-1.5",
            onClick: () => setShowUpload(true),
            style: {
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))"
            },
            "data-ocid": "orders.proof.open_modal_button",
            children: "📎 Tuma Uthibitisho wa Malipo"
          }
        ) })
      ]
    }
  );
}
function CustomerDashboard() {
  const { data: orders, isLoading } = useMyOrders();
  const { data: shops } = useAllShops();
  const { data: products } = useAllProducts();
  const uploadProofMutation = useUpdatePaymentProof();
  const updateNoteMutation = useUpdatePaymentNote();
  const getShopName = (shopId) => {
    var _a;
    return ((_a = shops == null ? void 0 : shops.find((s) => s.id === shopId)) == null ? void 0 : _a.name) || `Duka #${shopId}`;
  };
  const getProductName = (productId) => {
    var _a;
    return ((_a = products == null ? void 0 : products.find((p) => p.id === productId)) == null ? void 0 : _a.name) || `Bidhaa #${productId}`;
  };
  const getShopPaymentNumbers = (shopId) => {
    var _a;
    return ((_a = shops == null ? void 0 : shops.find((s) => s.id === shopId)) == null ? void 0 : _a.paymentNumbers) || "";
  };
  const handleUploadProof = (orderId, file, note) => {
    if (file) {
      uploadProofMutation.mutate(
        { orderId, file, paymentNote: note },
        {
          onSuccess: () => ue.success("Uthibitisho umetumwa kwa mafanikio!"),
          onError: () => ue.error("Hitilafu — jaribu tena")
        }
      );
    } else if (note.trim()) {
      updateNoteMutation.mutate(
        { orderId, paymentNote: note },
        {
          onSuccess: () => ue.success("Uthibitisho umetumwa kwa mafanikio!"),
          onError: () => ue.error("Hitilafu — jaribu tena")
        }
      );
    }
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.active.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shopPaymentNumbers: getShopPaymentNumbers(o.shopId),
                uploadProof: handleUploadProof,
                isUploading: uploadProofMutation.isPending || updateNoteMutation.isPending,
                "data-ocid": `orders.item.${i + 1}`
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.delivered.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shopPaymentNumbers: getShopPaymentNumbers(o.shopId),
                uploadProof: handleUploadProof,
                isUploading: uploadProofMutation.isPending || updateNoteMutation.isPending,
                "data-ocid": `orders.delivered.item.${i + 1}`
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: grouped.cancelled.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order: o,
                shopName: getShopName(o.shopId),
                productName: getProductName(o.productId),
                shopPaymentNumbers: getShopPaymentNumbers(o.shopId),
                uploadProof: handleUploadProof,
                isUploading: uploadProofMutation.isPending || updateNoteMutation.isPending,
                "data-ocid": `orders.cancelled.item.${i + 1}`
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
