import { c as createLucideIcon, r as reactExports, g as useActiveShops, h as useActiveShopsByCategory, j as jsxRuntimeExports, B as Button, M as MapPin, S as Skeleton, i as useShopProducts, k as usePlaceOrder, D as Dialog, l as DialogContent, m as DialogHeader, n as DialogTitle, f as ue } from "./index-D-oQYiAH.js";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-ChTROp8J.js";
import { B as Badge } from "./badge-BGbQ2dMa.js";
import { I as Input } from "./input-D98iWgjb.js";
import { B as BUSINESS_CATEGORIES, S as ShoppingCart } from "./categories-BMmyIsaP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }
  ]
];
const Facebook = createLucideIcon("facebook", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }]
];
const Locate = createLucideIcon("locate", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function formatDistance(meters) {
  if (meters < 1e3) return `${Math.round(meters)}m`;
  return `${(meters / 1e3).toFixed(1)}km`;
}
function ShopAvatar({ shop, size = 40 }) {
  var _a, _b;
  const logoUrl = ((_b = (_a = shop.logo) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) || null;
  const initials = shop.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const colors = [
    "hsl(220,70%,50%)",
    "hsl(150,60%,40%)",
    "hsl(330,60%,50%)",
    "hsl(30,80%,50%)",
    "hsl(260,60%,55%)",
    "hsl(190,70%,40%)"
  ];
  const colorIdx = shop.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIdx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { style: { width: size, height: size, flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvatarImage,
      {
        src: logoUrl || void 0,
        alt: shop.name,
        loading: size >= 50 ? "eager" : "lazy"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvatarFallback,
      {
        style: {
          background: bgColor,
          color: "white",
          fontSize: size < 50 ? "0.7rem" : "1rem",
          fontWeight: 700
        },
        children: initials
      }
    )
  ] });
}
function ProductCard({
  product,
  onOrder
}) {
  const imageUrl = product.image.getDirectURL();
  const [imgLoaded, setImgLoaded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden",
      style: {
        background: "hsl(var(--muted))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "aspect-square w-full overflow-hidden",
            style: { background: "hsl(var(--secondary))" },
            children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imageUrl,
                alt: product.name,
                className: "w-full h-full object-cover",
                loading: "lazy",
                decoding: "async",
                onLoad: () => setImgLoaded(true),
                style: {
                  opacity: imgLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease"
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShoppingCart,
              {
                size: 24,
                style: { color: "hsl(var(--muted-foreground))" }
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-semibold text-sm truncate",
              style: { color: "hsl(var(--card-foreground))" },
              children: product.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs mt-0.5",
              style: { color: "hsl(var(--muted-foreground))" },
              children: product.category
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-bold text-sm",
                style: { color: "hsl(var(--primary))" },
                children: [
                  "TZS ",
                  Number(product.price).toLocaleString()
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: Number(product.stock) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => onOrder(product),
              "data-ocid": "browser.order.primary_button",
              className: "w-full mt-2 text-xs font-semibold",
              style: {
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))"
              },
              disabled: Number(product.stock) === 0,
              children: Number(product.stock) === 0 ? "Imeisha" : "Agiza"
            }
          )
        ] })
      ]
    }
  );
}
function ShopCard({
  shop,
  idx,
  onSelect
}) {
  var _a, _b;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onSelect(shop),
      "data-ocid": `browser.shop.item.${idx + 1}`,
      className: "w-full text-left rounded-xl p-3 transition-all active:scale-[0.98]",
      style: {
        background: "hsl(var(--card))",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShopAvatar, { shop, size: 44 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2",
              style: {
                background: shop.isAvailable !== false ? "hsl(142,70%,45%)" : "hsl(var(--muted-foreground))",
                borderColor: "hsl(var(--card))"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-semibold",
                style: { color: "hsl(var(--card-foreground))" },
                children: shop.name
              }
            ),
            shop.distance !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-bold",
                style: {
                  background: "hsl(var(--primary) / 0.12)",
                  color: "hsl(var(--primary))"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDistance(shop.distance) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 mt-0.5",
              style: { color: "hsl(var(--muted-foreground))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate", children: shop.address })
              ]
            }
          ),
          shop.category && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
              style: {
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))"
              },
              children: [
                ((_a = BUSINESS_CATEGORIES.find((c) => c.id === shop.category)) == null ? void 0 : _a.emoji) || "🏪",
                " ",
                ((_b = BUSINESS_CATEGORIES.find((c) => c.id === shop.category)) == null ? void 0 : _b.label) || shop.category
              ]
            }
          ),
          shop.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs mt-1 line-clamp-1",
              style: { color: "hsl(var(--muted-foreground))" },
              children: shop.description
            }
          )
        ] })
      ] })
    }
  );
}
function getCategoryBannerGradient(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("welding") || cat.includes("useremala")) {
    return "linear-gradient(135deg, oklch(0.65 0.18 45), oklch(0.55 0.2 30))";
  }
  if (cat.includes("soko") || cat.includes("market")) {
    return "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.45 0.2 160))";
  }
  if (cat.includes("chipsi") || cat.includes("fast food") || cat.includes("food")) {
    return "linear-gradient(135deg, oklch(0.75 0.18 80), oklch(0.65 0.2 50))";
  }
  if (cat.includes("nyama") || cat.includes("choma") || cat.includes("meat")) {
    return "linear-gradient(135deg, oklch(0.55 0.18 20), oklch(0.45 0.15 35))";
  }
  return "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.5 0.25 320))";
}
function getCategoryBadgeColor(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("welding") || cat.includes("useremala"))
    return "oklch(0.6 0.18 45)";
  if (cat.includes("soko") || cat.includes("market"))
    return "oklch(0.5 0.18 145)";
  if (cat.includes("chipsi") || cat.includes("fast food"))
    return "oklch(0.65 0.18 65)";
  if (cat.includes("nyama") || cat.includes("choma"))
    return "oklch(0.5 0.15 25)";
  return "oklch(0.52 0.22 295)";
}
function ShopModal({
  shop,
  onClose,
  userPos
}) {
  const { data: products, isLoading } = useShopProducts(shop.id);
  const placeOrder = usePlaceOrder();
  const [orderProduct, setOrderProduct] = reactExports.useState(null);
  const [qty, setQty] = reactExports.useState(1);
  const distance = userPos ? calcDistance(userPos.lat, userPos.lon, shop.latitude, shop.longitude) : null;
  const confirmOrder = () => {
    if (!orderProduct) return;
    placeOrder.mutate(
      { productId: orderProduct.id, quantity: BigInt(qty) },
      {
        onSuccess: () => {
          ue.success("Agizo limetumwa!");
          setOrderProduct(null);
        },
        onError: () => ue.error("Hitilafu — jaribu tena")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "shop_modal.dialog",
      style: {
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-6 -mt-6 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative h-32 flex items-end justify-center pb-0",
              style: {
                background: getCategoryBannerGradient(
                  shop.category || ""
                )
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 opacity-10",
                    style: {
                      backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                      backgroundSize: "30px 30px"
                    }
                  }
                ),
                shop.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 inline-block" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-medium", children: "Active" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-9 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[72px] h-[72px] rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShopAvatar, { shop, size: 72 }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-12 pb-1 px-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: { color: "hsl(var(--card-foreground))" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xl leading-tight", children: shop.name }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-1 flex-wrap", children: [
              shop.category && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                  style: {
                    background: getCategoryBadgeColor(
                      shop.category || ""
                    ),
                    color: "white"
                  },
                  children: shop.category
                }
              ),
              distance !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1 text-xs",
                  style: { color: "hsl(var(--primary))" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 11 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                      formatDistance(distance),
                      " kutoka kwako"
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm",
              style: { color: "hsl(var(--muted-foreground))" },
              children: shop.description
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 text-sm",
              style: { color: "hsl(var(--muted-foreground))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shop.address })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1 flex-wrap", children: [
            shop.whatsapp && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`,
                target: "_blank",
                rel: "noreferrer",
                className: "flex items-center gap-1 text-xs",
                style: { color: "hsl(120,50%,45%)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 14 }),
                  " WhatsApp"
                ]
              }
            ),
            shop.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://instagram.com/${shop.instagram}`,
                target: "_blank",
                rel: "noreferrer",
                className: "flex items-center gap-1 text-xs",
                style: { color: "hsl(330,70%,55%)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 14 }),
                  " Instagram"
                ]
              }
            ),
            shop.facebook && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://facebook.com/${shop.facebook}`,
                target: "_blank",
                rel: "noreferrer",
                className: "flex items-center gap-1 text-xs",
                style: { color: "hsl(220,70%,55%)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { size: 14 }),
                  " Facebook"
                ]
              }
            ),
            shop.tiktok && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://tiktok.com/@${shop.tiktok}`,
                target: "_blank",
                rel: "noreferrer",
                className: "flex items-center gap-1 text-xs",
                style: { color: "hsl(var(--foreground))" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
                  " TikTok"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: "font-semibold text-sm mb-3",
              style: { color: "hsl(var(--foreground))" },
              children: "Bidhaa"
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" }, i)) }) : products && products.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product: p,
              onOrder: setOrderProduct
            },
            p.id.toString()
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-center py-6",
              style: { color: "hsl(var(--muted-foreground))" },
              "data-ocid": "shop_modal.products.empty_state",
              children: "Hakuna bidhaa bado"
            }
          )
        ] }),
        orderProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-4 p-4 rounded-xl",
            style: {
              background: "hsl(var(--muted))"
            },
            "data-ocid": "order_confirm.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "font-semibold text-sm mb-2",
                  style: { color: "hsl(var(--foreground))" },
                  children: [
                    "Agiza: ",
                    orderProduct.name
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm",
                    style: { color: "hsl(var(--muted-foreground))" },
                    children: "Idadi:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setQty((q) => Math.max(1, q - 1)),
                      className: "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
                      style: {
                        background: "hsl(var(--secondary))",
                        color: "hsl(var(--foreground))"
                      },
                      children: "-"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-8 text-center font-semibold",
                      style: { color: "hsl(var(--foreground))" },
                      children: qty
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setQty((q) => Math.min(Number(orderProduct.stock), q + 1)),
                      className: "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
                      style: {
                        background: "hsl(var(--secondary))",
                        color: "hsl(var(--foreground))"
                      },
                      children: "+"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-xs space-y-1 mb-3",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Jumla:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "TZS ",
                      (Number(orderProduct.price) * qty).toLocaleString()
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => setOrderProduct(null),
                    "data-ocid": "order_confirm.cancel_button",
                    className: "flex-1",
                    children: "Ghairi"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: confirmOrder,
                    disabled: placeOrder.isPending,
                    "data-ocid": "order_confirm.confirm_button",
                    className: "flex-1",
                    style: {
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))"
                    },
                    children: placeOrder.isPending ? "Inatuma..." : "Thibitisha"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
function ShopBrowser() {
  var _a, _b;
  const [selectedCategory, setSelectedCategory] = reactExports.useState(
    () => {
      try {
        return localStorage.getItem("ctm_last_category") || null;
      } catch {
        return null;
      }
    }
  );
  const { data: allActiveShops, isLoading: allLoading } = useActiveShops();
  const { data: categoryShops, isLoading: catLoading } = useActiveShopsByCategory(selectedCategory);
  const shops = selectedCategory ? categoryShops : allActiveShops;
  const isLoading = selectedCategory ? catLoading : allLoading;
  const [search, setSearch] = reactExports.useState("");
  const [selectedShop, setSelectedShop] = reactExports.useState(
    null
  );
  const [userPos, setUserPos] = reactExports.useState(
    null
  );
  const [_locationError, setLocationError] = reactExports.useState(false);
  const [locationLoading, setLocationLoading] = reactExports.useState(false);
  const categoryScrollRef = reactExports.useRef(null);
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationError(false);
        setLocationLoading(false);
      },
      () => {
        setLocationError(true);
        setLocationLoading(false);
      }
    );
  };
  reactExports.useEffect(() => {
    var _a2;
    (_a2 = navigator.geolocation) == null ? void 0 : _a2.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setLocationError(true)
    );
  }, []);
  const shopsWithDistance = (shops || []).map((shop) => ({
    ...shop,
    isAvailable: shop.isAvailable ?? true,
    distance: userPos ? calcDistance(userPos.lat, userPos.lon, shop.latitude, shop.longitude) : null
  }));
  const filtered = shopsWithDistance.filter((s) => s.isAvailable !== false).filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a.distance === null || b.distance === null) return 0;
    return a.distance - b.distance;
  });
  const nearby = filtered.filter(
    (s) => s.distance === null || s.distance <= 1e4
  );
  const farther = filtered.filter(
    (s) => s.distance !== null && s.distance > 1e4
  );
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
                  className: "text-xl font-bold mb-3",
                  style: { color: "hsl(var(--foreground))" },
                  children: "Soko"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    size: 16,
                    className: "absolute left-3 top-1/2 -translate-y-1/2",
                    style: { color: "hsl(var(--muted-foreground))" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Tafuta duka au bidhaa / Search shops...",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    className: "pl-9",
                    "data-ocid": "browser.search.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  ref: categoryScrollRef,
                  className: "flex gap-2 mt-3 overflow-x-auto pb-1",
                  style: { scrollbarWidth: "none" },
                  "data-ocid": "browser.categories.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setSelectedCategory(null);
                          try {
                            localStorage.removeItem("ctm_last_category");
                          } catch {
                          }
                        },
                        "data-ocid": "browser.category_all.toggle",
                        className: "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                        style: {
                          background: selectedCategory === null ? "hsl(var(--primary))" : "hsl(var(--muted))",
                          color: selectedCategory === null ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                          borderColor: selectedCategory === null ? "hsl(var(--primary))" : "hsl(var(--border))"
                        },
                        children: "🏪 Zote / All"
                      }
                    ),
                    BUSINESS_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const next = selectedCategory === cat.id ? null : cat.id;
                          setSelectedCategory(next);
                          try {
                            if (next) localStorage.setItem("ctm_last_category", next);
                            else localStorage.removeItem("ctm_last_category");
                          } catch {
                          }
                        },
                        "data-ocid": `browser.category_${cat.id}.toggle`,
                        className: "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                        style: {
                          background: selectedCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                          color: selectedCategory === cat.id ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                          borderColor: selectedCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--border))"
                        },
                        children: [
                          cat.emoji,
                          " ",
                          cat.label.split(" / ")[0]
                        ]
                      },
                      cat.id
                    ))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                userPos ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 text-xs",
                    style: { color: "hsl(150,55%,45%)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Locate, { size: 12 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Umbali unaonyeshwa / Distances shown" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs",
                      style: { color: "hsl(var(--muted-foreground))" },
                      children: "Washa eneo / Enable location"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: requestLocation,
                      disabled: locationLoading,
                      "data-ocid": "browser.location.primary_button",
                      className: "h-6 px-2 text-xs gap-1",
                      style: {
                        borderColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary))"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                        locationLoading ? "..." : "Tumia Eneo Langu"
                      ]
                    }
                  )
                ] }),
                selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-semibold px-2 py-0.5 rounded-full",
                    style: {
                      background: "hsl(var(--primary) / 0.12)",
                      color: "hsl(var(--primary))"
                    },
                    children: [
                      (_a = BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory)) == null ? void 0 : _a.emoji,
                      " ",
                      (_b = BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory)) == null ? void 0 : _b.label
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-2 pb-20", children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-20 rounded-xl",
            "data-ocid": "browser.loading_state"
          },
          i
        )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16",
            "data-ocid": "browser.shops.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ShoppingCart,
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
                  children: selectedCategory ? "Hakuna maduka katika aina hii" : "Hakuna maduka yaliyopatikana"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          nearby.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            userPos && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-semibold uppercase tracking-wide",
                style: { color: "hsl(var(--muted-foreground))" },
                children: "Karibu nawe (ndani ya 10km)"
              }
            ),
            nearby.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShopCard,
              {
                shop: s,
                idx: i,
                onSelect: setSelectedShop
              },
              s.id.toString()
            ))
          ] }),
          farther.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-semibold uppercase tracking-wide mt-2",
                style: { color: "hsl(var(--muted-foreground))" },
                children: "Maeneo mengine / Other areas"
              }
            ),
            farther.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShopCard,
              {
                shop: s,
                idx: nearby.length + i,
                onSelect: setSelectedShop
              },
              s.id.toString()
            ))
          ] })
        ] }) }),
        selectedShop && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ShopModal,
          {
            shop: selectedShop,
            onClose: () => setSelectedShop(null),
            userPos
          }
        )
      ]
    }
  );
}
export {
  ShopBrowser
};
