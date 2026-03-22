import { c as createLucideIcon, j as jsxRuntimeExports, m as cn, w as useAppSettings, V as usePendingReferences, W as useUpdateAppSettings, X as useApproveSubscriptionReference, Y as useRejectSubscriptionReference, r as reactExports, S as Skeleton, B as Button, f as ue } from "./index-BpbEfR1R.js";
import { B as Badge } from "./badge-DBzU9xj5.js";
import { I as Input } from "./input-D70HnHuQ.js";
import { L as Label } from "./label-BT1tvB5d.js";
import { L as LoaderCircle } from "./loader-circle-BKjf5rzf.js";
import { a as CircleCheckBig, C as CircleX } from "./circle-x-BC-R5iIm.js";
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
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function formatDate(nanos) {
  const ms = Number(nanos / BigInt(1e6));
  return new Date(ms).toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function AdminPanel() {
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings
  } = useAppSettings();
  const {
    data: pendingRefs,
    isLoading: refsLoading,
    refetch: refetchRefs
  } = usePendingReferences();
  const updateSettings = useUpdateAppSettings();
  const approve = useApproveSubscriptionReference();
  const reject = useRejectSubscriptionReference();
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
  const handleApprove = (id) => {
    approve.mutate(id, {
      onSuccess: () => {
        ue.success("Imeidhinishwa!");
        refetchRefs();
      },
      onError: () => ue.error("Hitilafu — jaribu tena")
    });
  };
  const handleReject = (id) => {
    reject.mutate(id, {
      onSuccess: () => {
        ue.success("Imekataliwa");
        refetchRefs();
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: { color: "hsl(var(--foreground))" }, children: "Namba ya Malipo ya Platform / Platform Payment Number" }),
                editingPayment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: paymentNumber,
                      onChange: (e) => setPaymentNumber(e.target.value),
                      placeholder: "M-Pesa: +255700000000",
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
                        setPaymentNumber((settings == null ? void 0 : settings.platformPaymentNumber) || "");
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
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border",
            style: {
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between p-4 border-b",
                  style: { borderColor: "hsl(var(--border))" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h2",
                        {
                          className: "font-bold text-base",
                          style: { color: "hsl(var(--foreground))" },
                          children: "Malipo Yanayosubiri / Pending References"
                        }
                      ),
                      pendingRefs && pendingRefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          style: {
                            background: "hsl(0,70%,50%)",
                            color: "#fff"
                          },
                          "data-ocid": "admin.pending_count.badge",
                          children: pendingRefs.length
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => refetchRefs(),
                        "data-ocid": "admin.pending_refs.refresh_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1" }),
                          "Onyesha upya"
                        ]
                      }
                    )
                  ]
                }
              ),
              refsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : !pendingRefs || pendingRefs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-10",
                  "data-ocid": "admin.pending_refs.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        size: 32,
                        className: "mx-auto mb-2",
                        style: { color: "hsl(120,50%,45%)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm",
                        style: { color: "hsl(var(--muted-foreground))" },
                        children: "Hakuna malipo yanayosubiri"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Duka" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Mmiliki" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ref #" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tarehe" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Vitendo" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: pendingRefs.map((ref, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    "data-ocid": `admin.pending_ref.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: ref.shopName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: ref.ownerName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "code",
                        {
                          className: "text-xs px-2 py-1 rounded",
                          style: {
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--foreground))"
                          },
                          children: ref.referenceNumber
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TableCell,
                        {
                          className: "text-xs",
                          style: { color: "hsl(var(--muted-foreground))" },
                          children: formatDate(ref.submittedAt)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            onClick: () => handleApprove(ref.id),
                            disabled: approve.isPending,
                            style: {
                              background: "hsl(120,50%,40%)",
                              color: "#fff"
                            },
                            "data-ocid": `admin.approve_ref.primary_button.${i + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 13, className: "mr-1" }),
                              "Idhinisha"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            onClick: () => handleReject(ref.id),
                            disabled: reject.isPending,
                            style: {
                              color: "hsl(0,70%,50%)",
                              borderColor: "hsl(0,70%,50%)"
                            },
                            "data-ocid": `admin.reject_ref.delete_button.${i + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13, className: "mr-1" }),
                              "Kataa"
                            ]
                          }
                        )
                      ] }) })
                    ]
                  },
                  ref.id.toString()
                )) })
              ] }) })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  AdminPanel
};
