import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { Product, Shop } from "../backend.d";

import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";
import { formatDistance, haversineDistance } from "../utils/distance";

function ProductImage({ product }: { product: Product }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string;
    product.image
      .getBytes()
      .then((bytes) => {
        if (bytes.length === 0) return;
        url = URL.createObjectURL(new Blob([bytes]));
        setImgUrl(url);
      })
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [product.image]);

  return (
    <div className="aspect-square bg-muted relative overflow-hidden">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function ShopCard({
  shop,
  distance,
  onClick,
}: {
  shop: Shop;
  distance: number | null;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors flex flex-col gap-3"
      data-ocid="shop.card"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-base">{shop.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {shop.description}
          </p>
        </div>
        {distance !== null && (
          <Badge
            variant="secondary"
            className="shrink-0 text-xs flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            {formatDistance(distance)}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {shop.address}
      </p>
      {/* Social Links */}
      <div
        className="flex gap-3 items-center"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {shop.tiktok && (
          <a
            href={shop.tiktok}
            target="_blank"
            rel="noreferrer"
            data-ocid="shop.tiktok_link"
          >
            <SiTiktok className="w-4 h-4" />
          </a>
        )}
        {shop.facebook && (
          <a
            href={shop.facebook}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
            data-ocid="shop.facebook_link"
          >
            <SiFacebook className="w-4 h-4" />
          </a>
        )}
        {shop.instagram && (
          <a
            href={shop.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-pink-500"
            data-ocid="shop.instagram_link"
          >
            <SiInstagram className="w-4 h-4" />
          </a>
        )}
        {shop.whatsapp && (
          <a
            href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-green-500"
            data-ocid="shop.whatsapp_link"
          >
            <SiWhatsapp className="w-4 h-4" />
          </a>
        )}
      </div>
      <Button
        size="sm"
        className="rounded-full w-full mt-1"
        onClick={onClick}
        data-ocid="shop.open_button"
      >
        View Products & Order
      </Button>
    </motion.div>
  );
}

function ShopProductsModal({
  shop,
  onClose,
}: {
  shop: Shop;
  onClose: () => void;
}) {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [placing, setPlacing] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["shopProducts", shop.id.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShopProducts(shop.id);
    },
    enabled: !!actor && !isFetching,
  });

  async function handlePlaceOrder() {
    if (!actor) {
      toast.error("Please login to place orders");
      return;
    }
    if (!orderProduct) return;
    setPlacing(true);
    try {
      await actor.placeOrder(orderProduct.id, BigInt(Number(quantity) || 1));
      toast.success("Order placed!");
      qc.invalidateQueries({ queryKey: ["myOrders"] });
      setOrderProduct(null);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="bg-card border-border rounded-2xl max-h-[85vh] overflow-y-auto w-full max-w-lg"
          data-ocid="shop.products_dialog"
        >
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-lg font-bold">
                  {shop.name}
                </DialogTitle>
                {shop.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {shop.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="shop.products_dialog.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div
              className="flex justify-center py-8"
              data-ocid="shop.products_loading_state"
            >
              <Loader2 className="w-6 h-6 animate-spin gold-text" />
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="shop.products_empty_state"
            >
              <Package className="w-10 h-10 mx-auto mb-2" />
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {products.map((p, i) => {
                const price = Number(p.price) / 100;
                return (
                  <motion.div
                    key={p.id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-background border border-border rounded-xl overflow-hidden flex flex-col"
                    data-ocid={`shop.product.item.${i + 1}`}
                  >
                    <ProductImage product={p} />
                    <div className="p-3 flex flex-col gap-2">
                      <p className="font-semibold text-sm line-clamp-2">
                        {p.name}
                      </p>
                      <p className="gold-text font-bold text-sm">
                        ${price.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        className="rounded-full w-full"
                        onClick={() => {
                          if (!actor) {
                            toast.error("Please login to place orders");
                            return;
                          }
                          setOrderProduct(p);
                          setQuantity("1");
                        }}
                        data-ocid={`shop.order_button.${i + 1}`}
                      >
                        Order
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order confirm dialog */}
      <Dialog
        open={!!orderProduct}
        onOpenChange={(v) => !v && setOrderProduct(null)}
      >
        <DialogContent
          className="bg-card border-border rounded-2xl"
          data-ocid="shop.order_confirm_dialog"
        >
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          {orderProduct && (
            <div className="flex flex-col gap-4">
              <p className="font-semibold">{orderProduct.name}</p>
              <p className="text-muted-foreground text-sm">
                ${(Number(orderProduct.price) / 100).toFixed(2)} each
              </p>
              <div className="flex flex-col gap-1">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePlaceOrder()}
                  className="rounded-xl"
                  data-ocid="shop.quantity_input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full gold-border gold-text"
                  onClick={() => setOrderProduct(null)}
                  data-ocid="shop.order_confirm_dialog.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-full"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  data-ocid="shop.order_confirm_dialog.confirm_button"
                >
                  {placing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {placing ? "Placing..." : "Confirm Order"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ShopBrowser() {
  const { actor, isFetching } = useActor();
  const { isAuthenticated, setPage } = useAuth();
  const [search, setSearch] = useState("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLon(pos.coords.longitude);
      },
      () => {},
    );
  }, []);

  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ["allShops"],
    queryFn: async () => {
      if (!actor) {
        try {
          const cached = localStorage.getItem("cached_shops");
          if (cached) {
            setIsOffline(true);
            return JSON.parse(cached);
          }
        } catch {}
        return [];
      }
      try {
        const data = await actor.getAllShops();
        try {
          localStorage.setItem("cached_shops", JSON.stringify(data));
        } catch {}
        setIsOffline(false);
        return data;
      } catch {
        try {
          const cached = localStorage.getItem("cached_shops");
          if (cached) {
            setIsOffline(true);
            return JSON.parse(cached);
          }
        } catch {}
        return [];
      }
    },
    enabled: !isFetching,
  });

  const shopsWithDistance = shops.map((s) => ({
    shop: s,
    distance:
      userLat !== null && userLon !== null
        ? haversineDistance(userLat, userLon, s.latitude, s.longitude)
        : null,
  }));

  const nearby = shopsWithDistance.filter(
    (s) => s.distance === null || s.distance <= 10000,
  );
  const displayed = showAll ? shopsWithDistance : nearby;

  const filtered = displayed.filter(
    (s) => !search || s.shop.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col" data-ocid="shop.page">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
        <span className="font-display text-xl font-extrabold gold-text tracking-widest">
          CLOSER
        </span>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Store className="w-4 h-4" /> Shops ({shops.length})
        </span>
      </header>

      {isOffline && (
        <div
          className="bg-yellow-500/20 text-yellow-500 text-xs text-center py-2 px-4"
          data-ocid="shop.offline_state"
        >
          Offline — showing cached data
        </div>
      )}

      <main className="flex-1 px-4 py-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="shop.search_input"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        {userLat !== null &&
          !showAll &&
          nearby.length === 0 &&
          shops.length > 0 && (
            <div className="text-center py-8" data-ocid="shop.no_nearby_state">
              <p className="text-muted-foreground mb-3">
                No shops within 10 km of your location.
              </p>
              <Button
                variant="outline"
                className="rounded-full gold-border gold-text"
                onClick={() => setShowAll(true)}
                data-ocid="shop.show_all_button"
              >
                Show All Available Shops
              </Button>
            </div>
          )}

        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="shop.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin gold-text" />
          </div>
        ) : filtered.length === 0 && shops.length > 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="shop.empty_state"
          >
            No shops found.
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="shop.empty_state"
          >
            No shops registered yet. Be the first to open one!
          </div>
        ) : (
          <>
            {userLat !== null && !showAll && (
              <p className="text-xs text-muted-foreground mb-4">
                Showing shops within 10 km · {filtered.length} found
              </p>
            )}
            {showAll && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground">
                  Showing all shops ({filtered.length})
                </p>
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="text-xs gold-text hover:underline"
                  data-ocid="shop.show_nearby_button"
                >
                  Show nearby only
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(({ shop, distance }, i) => (
                <motion.div
                  key={shop.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`shop.item.${i + 1}`}
                >
                  <ShopCard
                    shop={shop}
                    distance={distance}
                    onClick={() => setSelectedShop(shop)}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

      {selectedShop && (
        <ShopProductsModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
        />
      )}

      {/* Bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border flex items-stretch h-16"
        data-ocid="shop.nav"
      >
        <button
          type="button"
          onClick={() => setPage("shop-browser")}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 gold-text transition-colors"
          data-ocid="shop.market.tab"
          aria-label="Market"
        >
          <span className="scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </span>
          <span className="text-[10px]">Market</span>
        </button>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setPage("customer")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="shop.customer.tab"
            aria-label="Customer"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px]">My Orders</span>
          </button>
        )}
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setPage("shop-owner")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="shop.office.tab"
            aria-label="Office"
          >
            <Store className="w-6 h-6" />
            <span className="text-[10px]">My Office</span>
          </button>
        )}
      </nav>

      <footer className="text-center py-4 text-muted-foreground text-xs border-t border-border">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="gold-text hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
