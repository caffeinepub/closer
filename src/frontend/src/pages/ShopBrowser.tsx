import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Locate,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product, Shop } from "../backend";
import { BUSINESS_CATEGORIES } from "../constants/categories";
import {
  useActiveShops,
  useActiveShopsByCategory,
  useAddShopReview,
  usePlaceOrder,
  useShopAverageRating,
  useShopProducts,
  useShopReviews,
} from "../hooks/useQueries";
import type { ShopReview } from "../types/shopReview";
import { calcDistance, formatDistance } from "../utils/distance";

function ShopAvatar({ shop, size = 40 }: { shop: Shop; size?: number }) {
  const logoUrl = shop.logo?.getDirectURL?.() || null;
  const initials = shop.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = [
    "hsl(220,70%,50%)",
    "hsl(150,60%,40%)",
    "hsl(330,60%,50%)",
    "hsl(30,80%,50%)",
    "hsl(260,60%,55%)",
    "hsl(190,70%,40%)",
  ];
  const colorIdx =
    shop.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    colors.length;
  const bgColor = colors[colorIdx];

  return (
    <Avatar style={{ width: size, height: size, flexShrink: 0 }}>
      <AvatarImage
        src={logoUrl || undefined}
        alt={shop.name}
        loading={size >= 50 ? "eager" : "lazy"}
      />
      <AvatarFallback
        style={{
          background: bgColor,
          color: "white",
          fontSize: size < 50 ? "0.7rem" : "1rem",
          fontWeight: 700,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function ProductCard({
  product,
  onOrder,
}: { product: Product; onOrder: (p: Product) => void }) {
  const imageUrl = product.image.getDirectURL();
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "hsl(var(--muted))",
      }}
    >
      <div
        className="aspect-square w-full overflow-hidden"
        style={{ background: "hsl(var(--secondary))" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart
              size={24}
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
          </div>
        )}
      </div>
      <div className="p-3">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: "hsl(var(--card-foreground))" }}
        >
          {product.name}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {product.category}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="font-bold text-sm"
            style={{ color: "hsl(var(--primary))" }}
          >
            TZS {Number(product.price).toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            {Number(product.stock)}
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={() => onOrder(product)}
          data-ocid="browser.order.primary_button"
          className="w-full mt-2 text-xs font-semibold"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
          disabled={Number(product.stock) === 0}
        >
          {Number(product.stock) === 0 ? "Imeisha" : "Agiza"}
        </Button>
      </div>
    </div>
  );
}

type ShopWithDistance = ShopWithAvailability & { distance: number | null };
type ShopWithAvailability = Shop & { isAvailable: boolean };

function ShopCard({
  shop,
  idx,
  onSelect,
}: {
  shop: ShopWithDistance;
  idx: number;
  onSelect: (s: ShopWithDistance) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(shop)}
      data-ocid={`browser.shop.item.${idx + 1}`}
      className="w-full text-left rounded-xl p-3 transition-all active:scale-[0.98]"
      style={{
        background: "hsl(var(--card))",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <ShopAvatar shop={shop} size={44} />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{
              background:
                shop.isAvailable !== false
                  ? "hsl(142,70%,45%)"
                  : "hsl(var(--muted-foreground))",
              borderColor: "hsl(var(--card))",
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className="font-semibold"
              style={{ color: "hsl(var(--card-foreground))" }}
            >
              {shop.name}
            </p>
            {shop.distance !== null && (
              <div
                className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "hsl(var(--primary) / 0.12)",
                  color: "hsl(var(--primary))",
                }}
              >
                <Navigation size={11} />
                <span>{formatDistance(shop.distance)}</span>
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-1 mt-0.5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <MapPin size={11} />
            <span className="text-xs truncate">{shop.address}</span>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(shop as any).category && (
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
              }}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {BUSINESS_CATEGORIES.find((c) => c.id === (shop as any).category)
                ?.emoji || "🏪"}{" "}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {BUSINESS_CATEGORIES.find((c) => c.id === (shop as any).category)
                ?.label || (shop as any).category}
            </span>
          )}
          <ShopRatingBadge shopId={shop.id} />
          {shop.description && (
            <p
              className="text-xs mt-1 line-clamp-1"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {shop.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function getCategoryBannerGradient(category: string): string {
  const cat = (category || "").toLowerCase();
  if (cat.includes("welding") || cat.includes("useremala")) {
    return "linear-gradient(135deg, oklch(0.65 0.18 45), oklch(0.55 0.2 30))";
  }
  if (cat.includes("soko") || cat.includes("market")) {
    return "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.45 0.2 160))";
  }
  if (
    cat.includes("chipsi") ||
    cat.includes("fast food") ||
    cat.includes("food")
  ) {
    return "linear-gradient(135deg, oklch(0.75 0.18 80), oklch(0.65 0.2 50))";
  }
  if (cat.includes("nyama") || cat.includes("choma") || cat.includes("meat")) {
    return "linear-gradient(135deg, oklch(0.55 0.18 20), oklch(0.45 0.15 35))";
  }
  return "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.5 0.25 320))";
}

function getCategoryBadgeColor(category: string): string {
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
  userPos,
}: {
  shop: ShopWithDistance;
  onClose: () => void;
  userPos: { lat: number; lon: number } | null;
}) {
  const { data: products, isLoading } = useShopProducts(shop.id);
  const placeOrder = usePlaceOrder();
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const distance = userPos
    ? calcDistance(userPos.lat, userPos.lon, shop.latitude, shop.longitude)
    : null;

  const confirmOrder = () => {
    if (!orderProduct) return;
    placeOrder.mutate(
      { productId: orderProduct.id, quantity: BigInt(qty) },
      {
        onSuccess: () => {
          toast.success("Agizo limetumwa!");
          setOrderProduct(null);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="shop_modal.dialog"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        {/* Shop Banner Header */}
        <div className="-mx-6 -mt-6 mb-4">
          <div
            className="relative h-32 flex items-end justify-center pb-0"
            style={{
              background: getCategoryBannerGradient(
                (shop as any).category || "",
              ),
            }}
          >
            {/* Decorative pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            {/* Active badge */}
            {shop.isActive && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span className="text-white text-xs font-medium">Active</span>
              </div>
            )}
            {/* Avatar overlapping bottom */}
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
              <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <ShopAvatar shop={shop} size={72} />
              </div>
            </div>
          </div>
          {/* Name & meta below banner */}
          <div className="pt-12 pb-1 px-6 text-center">
            <DialogHeader>
              <DialogTitle style={{ color: "hsl(var(--card-foreground))" }}>
                <p className="font-bold text-xl leading-tight">{shop.name}</p>
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              {(shop as any).category && (
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: getCategoryBadgeColor(
                      (shop as any).category || "",
                    ),
                    color: "white",
                  }}
                >
                  {(shop as any).category}
                </span>
              )}
              {distance !== null && (
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  <Navigation size={11} />
                  <span className="font-semibold">
                    {formatDistance(distance)} kutoka kwako
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shop info */}
        <div className="space-y-2">
          <p
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {shop.description}
          </p>
          <div
            className="flex items-center gap-1 text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <MapPin size={14} />
            <span>{shop.address}</span>
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-1 flex-wrap">
            {shop.whatsapp && (
              <a
                href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs"
                style={{ color: "hsl(120,50%,45%)" }}
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {shop.instagram && (
              <a
                href={`https://instagram.com/${shop.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs"
                style={{ color: "hsl(330,70%,55%)" }}
              >
                <Instagram size={14} /> Instagram
              </a>
            )}
            {shop.facebook && (
              <a
                href={`https://facebook.com/${shop.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs"
                style={{ color: "hsl(220,70%,55%)" }}
              >
                <Facebook size={14} /> Facebook
              </a>
            )}
            {shop.tiktok && (
              <a
                href={`https://tiktok.com/@${shop.tiktok}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <ExternalLink size={14} /> TikTok
              </a>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="mt-4">
          <h3
            className="font-semibold text-sm mb-3"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Bidhaa
          </h3>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {products.map((p) => (
                <ProductCard
                  key={p.id.toString()}
                  product={p}
                  onOrder={setOrderProduct}
                />
              ))}
            </div>
          ) : (
            <p
              className="text-sm text-center py-6"
              style={{ color: "hsl(var(--muted-foreground))" }}
              data-ocid="shop_modal.products.empty_state"
            >
              Hakuna bidhaa bado
            </p>
          )}
        </div>

        {/* Rating & Review */}
        <ShopReviewSection shop={shop} />

        {/* Order confirm */}
        {orderProduct && (
          <div
            className="mt-4 p-4 rounded-xl"
            style={{
              background: "hsl(var(--muted))",
            }}
            data-ocid="order_confirm.panel"
          >
            <p
              className="font-semibold text-sm mb-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Agiza: {orderProduct.name}
            </p>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Idadi:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  -
                </button>
                <span
                  className="w-8 text-center font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) => Math.min(Number(orderProduct.stock), q + 1))
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div
              className="text-xs space-y-1 mb-3"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <div className="flex justify-between">
                <span>Jumla:</span>
                <span>
                  TZS {(Number(orderProduct.price) * qty).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOrderProduct(null)}
                data-ocid="order_confirm.cancel_button"
                className="flex-1"
              >
                Ghairi
              </Button>
              <Button
                size="sm"
                onClick={confirmOrder}
                disabled={placeOrder.isPending}
                data-ocid="order_confirm.confirm_button"
                className="flex-1"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                {placeOrder.isPending ? "Inatuma..." : "Thibitisha"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ShopRatingBadge({ shopId }: { shopId: bigint }) {
  const { data: avgRating } = useShopAverageRating(shopId);
  if (!avgRating || Number(avgRating[1]) === 0) return null;
  const avg = Number(avgRating[0]) / 10;
  const count = Number(avgRating[1]);
  return (
    <span
      className="inline-flex items-center gap-1 mt-1 text-xs font-medium"
      style={{ color: "hsl(40,90%,45%)" }}
    >
      ⭐ {avg.toFixed(1)}
      <span style={{ color: "hsl(var(--muted-foreground))" }}>
        ({count} maoni)
      </span>
    </span>
  );
}

function StarSelector({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-xl leading-none cursor-pointer select-none hover:scale-110 transition-transform"
          style={{
            color:
              star <= value
                ? "hsl(40,90%,50%)"
                : "hsl(var(--muted-foreground))",
          }}
          data-ocid={`shop_review.star.${star}`}
        >
          {star <= value ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

function ShopReviewSection({ shop }: { shop: ShopWithDistance }) {
  const { data: reviews, isLoading: reviewsLoading } = useShopReviews(shop.id);
  const { data: avgRating } = useShopAverageRating(shop.id);
  const addReview = useAddShopReview();
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  const handleSubmit = () => {
    if (myRating === 0) {
      toast.error("Tafadhali chagua nyota");
      return;
    }
    addReview.mutate(
      { shopId: shop.id, rating: myRating, comment: myComment },
      {
        onSuccess: () => {
          toast.success("Maoni yametumwa!");
          setMyRating(0);
          setMyComment("");
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const avgCount = avgRating ? Number(avgRating[1]) : 0;
  const avgScore =
    avgRating && avgCount > 0 ? (Number(avgRating[0]) / 10).toFixed(1) : null;

  return (
    <div className="mt-5" data-ocid="shop_review.section">
      <h3
        className="font-semibold text-sm mb-2"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Maoni ya Wateja
      </h3>

      {/* Average display */}
      {avgScore && (
        <div
          className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
          style={{ background: "hsl(40,90%,95%)" }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: "hsl(40,80%,45%)" }}
          >
            ⭐ {avgScore}
          </span>
          <span
            className="text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            kutoka maoni {avgCount}
          </span>
        </div>
      )}

      {/* Review form */}
      <div className="mb-4 space-y-2">
        <StarSelector value={myRating} onChange={setMyRating} />
        <Textarea
          value={myComment}
          onChange={(e) => setMyComment(e.target.value)}
          placeholder="Andika maoni (hiari)"
          className="text-sm resize-none"
          rows={2}
          data-ocid="shop_review.textarea"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={addReview.isPending || myRating === 0}
          data-ocid="shop_review.submit_button"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          {addReview.isPending ? "Inatuma..." : "Tuma Maoni"}
        </Button>
      </div>

      {/* Reviews list */}
      {reviewsLoading ? (
        <p
          className="text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Inapakia...
        </p>
      ) : !reviews || reviews.length === 0 ? (
        <p
          className="text-xs py-2"
          style={{ color: "hsl(var(--muted-foreground))" }}
          data-ocid="shop_review.empty_state"
        >
          Hakuna maoni bado
        </p>
      ) : (
        <div className="space-y-2">
          {reviews.map((review: ShopReview, i: number) => (
            <ReviewCard key={review.id.toString()} review={review} idx={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, idx }: { review: ShopReview; idx: number }) {
  const stars = Number(review.rating);
  const date = review.timestamp
    ? new Date(Number(review.timestamp) / 1_000_000).toLocaleDateString(
        "sw-TZ",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : "";
  return (
    <div
      className="rounded-xl px-3 py-2 space-y-1"
      style={{ background: "hsl(var(--muted))" }}
      data-ocid={`shop_review.item.${idx + 1}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-semibold text-xs"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {review.userName || "Mtumiaji"}
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((si) => (
            <span
              key={`star-${si}`}
              className="text-sm"
              style={{
                color:
                  si <= stars
                    ? "hsl(40,90%,50%)"
                    : "hsl(var(--muted-foreground))",
              }}
            >
              {si <= stars ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>
      {review.comment && (
        <p
          className="text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {review.comment}
        </p>
      )}
      {date && (
        <p
          className="text-xs"
          style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}
        >
          {date}
        </p>
      )}
    </div>
  );
}

export function ShopBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem("ctm_last_category") || null;
      } catch {
        return null;
      }
    },
  );
  const { data: allActiveShops, isLoading: allLoading } = useActiveShops();
  const { data: categoryShops, isLoading: catLoading } =
    useActiveShopsByCategory(selectedCategory);

  const shops = selectedCategory ? categoryShops : allActiveShops;
  const isLoading = selectedCategory ? catLoading : allLoading;

  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<ShopWithDistance | null>(
    null,
  );
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [_locationError, setLocationError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

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
      },
    );
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setLocationError(true),
    );
  }, []);

  const shopsWithDistance: ShopWithDistance[] = (shops || []).map((shop) => ({
    ...shop,
    isAvailable: (shop as ShopWithAvailability).isAvailable ?? true,
    distance: userPos
      ? calcDistance(userPos.lat, userPos.lon, shop.latitude, shop.longitude)
      : null,
  }));

  const filtered = shopsWithDistance
    .filter((s) => s.isAvailable !== false)
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.distance === null || b.distance === null) return 0;
      return a.distance - b.distance;
    });

  const nearby = filtered.filter(
    (s) => s.distance === null || s.distance <= 10000,
  );
  const farther = filtered.filter(
    (s) => s.distance !== null && s.distance > 10000,
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 sticky top-0 z-10"
        style={{
          background: "hsl(var(--background))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <h1
          className="text-xl font-bold mb-3"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Soko
        </h1>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          />
          <Input
            placeholder="Tafuta duka au bidhaa / Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="browser.search.search_input"
          />
        </div>

        {/* Category Filter Row */}
        <div
          ref={categoryScrollRef}
          className="flex gap-2 mt-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
          data-ocid="browser.categories.panel"
        >
          {/* All button */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              try {
                localStorage.removeItem("ctm_last_category");
              } catch {}
            }}
            data-ocid="browser.category_all.toggle"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background:
                selectedCategory === null
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted))",
              color:
                selectedCategory === null
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--muted-foreground))",
              borderColor:
                selectedCategory === null
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))",
            }}
          >
            🏪 Zote / All
          </button>

          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                const next = selectedCategory === cat.id ? null : cat.id;
                setSelectedCategory(next);
                try {
                  if (next) localStorage.setItem("ctm_last_category", next);
                  else localStorage.removeItem("ctm_last_category");
                } catch {}
              }}
              data-ocid={`browser.category_${cat.id}.toggle`}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background:
                  selectedCategory === cat.id
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                color:
                  selectedCategory === cat.id
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--muted-foreground))",
                borderColor:
                  selectedCategory === cat.id
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
              }}
            >
              {cat.emoji} {cat.label.split(" / ")[0]}
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          {userPos ? (
            <div
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "hsl(150,55%,45%)" }}
            >
              <Locate size={12} />
              <span>Umbali unaonyeshwa / Distances shown</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Washa eneo / Enable location
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={requestLocation}
                disabled={locationLoading}
                data-ocid="browser.location.primary_button"
                className="h-6 px-2 text-xs gap-1"
                style={{
                  borderColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary))",
                }}
              >
                <MapPin size={11} />
                {locationLoading ? "..." : "Tumia Eneo Langu"}
              </Button>
            </div>
          )}

          {selectedCategory && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "hsl(var(--primary) / 0.12)",
                color: "hsl(var(--primary))",
              }}
            >
              {
                BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.emoji
              }{" "}
              {
                BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.label
              }
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 pb-20">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-20 rounded-xl"
              data-ocid="browser.loading_state"
            />
          ))
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-ocid="browser.shops.empty_state"
          >
            <ShoppingCart
              size={40}
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {selectedCategory
                ? "Hakuna maduka katika aina hii"
                : "Hakuna maduka yaliyopatikana"}
            </p>
          </div>
        ) : (
          <>
            {nearby.length > 0 && (
              <>
                {userPos && (
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Karibu nawe (ndani ya 10km)
                  </p>
                )}
                {nearby.map((s, i) => (
                  <ShopCard
                    key={s.id.toString()}
                    shop={s}
                    idx={i}
                    onSelect={setSelectedShop}
                  />
                ))}
              </>
            )}
            {farther.length > 0 && (
              <>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mt-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Maeneo mengine / Other areas
                </p>
                {farther.map((s, i) => (
                  <ShopCard
                    key={s.id.toString()}
                    shop={s}
                    idx={nearby.length + i}
                    onSelect={setSelectedShop}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {selectedShop && (
        <ShopModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          userPos={userPos}
        />
      )}
    </div>
  );
}
