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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product, Shop } from "../backend";
import {
  useActiveShops,
  usePlaceOrder,
  useShopProducts,
} from "../hooks/useQueries";
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
      className="rounded-xl overflow-hidden border"
      style={{
        background: "hsl(var(--muted))",
        borderColor: "hsl(var(--border))",
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
      className="w-full text-left rounded-xl p-3 border transition-all active:scale-[0.98]"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
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
  const [paymentInfo, setPaymentInfo] = useState<{
    total: number;
    paymentNumbers: string;
  } | null>(null);

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
          const total = Number(orderProduct.price) * qty;
          setPaymentInfo({ total, paymentNumbers: shop.paymentNumbers || "" });
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
        <DialogHeader>
          <DialogTitle style={{ color: "hsl(var(--card-foreground))" }}>
            <div className="flex items-center gap-3">
              <ShopAvatar shop={shop} size={64} />
              <div>
                <p className="font-bold text-lg">{shop.name}</p>
                {distance !== null && (
                  <div
                    className="flex items-center gap-1 text-sm mt-0.5"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    <Navigation size={13} />
                    <span className="font-semibold">
                      {formatDistance(distance)} kutoka kwako
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

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

          {/* Payment numbers — visible to customers BEFORE placing order */}
          {shop.paymentNumbers && (
            <div
              className="mt-2 p-3 rounded-xl border"
              style={{
                background: "hsl(142 50% 50% / 0.1)",
                borderColor: "hsl(142 50% 50% / 0.4)",
              }}
              data-ocid="shop_modal.payment_numbers.panel"
            >
              <p
                className="font-semibold text-sm mb-1"
                style={{ color: "hsl(var(--foreground))" }}
              >
                💳 Namba za Malipo / Payment Numbers
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {shop.paymentNumbers}
              </p>
            </div>
          )}
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

        {/* Order confirm */}
        {orderProduct && (
          <div
            className="mt-4 p-4 rounded-xl border"
            style={{
              background: "hsl(var(--muted))",
              borderColor: "hsl(var(--border))",
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

        {/* Payment info after order placed */}
        {paymentInfo && (
          <div
            className="mt-4 p-4 rounded-xl border"
            style={{
              background: "hsl(45 90% 55% / 0.08)",
              borderColor: "hsl(45 90% 55% / 0.4)",
            }}
            data-ocid="order_confirm.payment.panel"
          >
            <p
              className="font-bold text-sm mb-2"
              style={{ color: "hsl(45,90%,40%)" }}
            >
              ✅ Agizo limewekwa! / Order placed!
            </p>
            <p
              className="font-semibold text-sm mb-1"
              style={{ color: "hsl(var(--foreground))" }}
            >
              💳 Lipa Hapa / Pay Here
            </p>
            {paymentInfo.paymentNumbers ? (
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {paymentInfo.paymentNumbers}
              </p>
            ) : (
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Wasiliana na duka kwa maelezo ya malipo.
              </p>
            )}
            <p
              className="text-xs mt-1"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Kiasi / Amount: TZS {paymentInfo.total.toLocaleString()}
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Baada ya kulipa, nenda kwenye "Maagizo Yangu" kupakia uthibitisho.
            </p>
            <button
              type="button"
              onClick={() => setPaymentInfo(null)}
              className="mt-2 text-xs underline"
              style={{ color: "hsl(var(--muted-foreground))" }}
              data-ocid="order_confirm.payment.close_button"
            >
              Funga / Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ShopBrowser() {
  const { data: shops, isLoading } = useActiveShops();
  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<ShopWithDistance | null>(
    null,
  );
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [_locationError, setLocationError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

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
              Hakuna maduka yaliyopatikana
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
