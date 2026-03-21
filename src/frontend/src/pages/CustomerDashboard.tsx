import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Order, Product, Shop } from "../backend.d";

import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

function ProductCard({
  product,
  shops,
  onOrder,
}: { product: Product; shops: Shop[]; onOrder: () => void }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const shop = shops.find((s) => s.id === product.shopId);

  useState(() => {
    let url: string;
    product.image
      .getBytes()
      .then((bytes) => {
        url = URL.createObjectURL(new Blob([bytes]));
        setImgUrl(url);
      })
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  });

  const price = Number(product.price) / 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-colors flex flex-col"
      data-ocid="customer.product.card"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 text-xs">
          {product.category}
        </Badge>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
        {shop && <p className="text-xs text-muted-foreground">{shop.name}</p>}
        <div className="mt-auto flex items-center justify-between">
          <span className="gold-text font-bold">${price.toFixed(2)}</span>
          <Button
            size="sm"
            className="rounded-full"
            onClick={onOrder}
            data-ocid="customer.order_button"
          >
            Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const total = Number(order.totalPrice) / 100;
  const commission = Number(order.commissionAmount) / 100;
  const shopGets = total - commission;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { actor } = useActor();
  const qc = useQueryClient();

  async function handleUploadProof() {
    if (!actor || !file) return;
    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      await actor.updatePaymentProof(order.id, blob);
      toast.success("Payment proof uploaded!");
      qc.invalidateQueries({ queryKey: ["myOrders"] });
      setUploadOpen(false);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
      data-ocid="customer.order.card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Order #{order.id.toString()}
        </span>
        <Badge variant={order.status === "completed" ? "default" : "secondary"}>
          {order.status}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mt-1">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold gold-text">${total.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Platform (10%)</span>
          <span className="font-semibold">${commission.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Shop gets</span>
          <span className="font-semibold">${shopGets.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          Qty: {order.quantity.toString()}
        </span>
        {order.paymentStatus === "pending" && (
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs gold-border gold-text"
                data-ocid="customer.upload_proof_button"
              >
                <CreditCard className="w-3 h-3 mr-1" /> Upload Proof
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle>Upload Payment Proof</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Label>Select screenshot or receipt</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  data-ocid="customer.proof_upload_input"
                />
                <Button
                  className="rounded-full"
                  onClick={handleUploadProof}
                  disabled={!file || uploading}
                  data-ocid="customer.proof_submit_button"
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {uploading ? "Uploading..." : "Submit Proof"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { actor, isFetching } = useActor();
  const { isAuthenticated, setPage } = useAuth();
  const [search, setSearch] = useState("");
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [placing, setPlacing] = useState(false);
  const qc = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getAllProducts();
      try {
        localStorage.setItem("cached_products", JSON.stringify(data));
      } catch {}
      return data;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: shops = [] } = useQuery<Shop[]>({
    queryKey: ["allShops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShops();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: myOrders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const filteredProducts = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  async function handlePlaceOrder() {
    if (!actor || !orderProduct) return;
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
    <div className="min-h-screen flex flex-col" data-ocid="customer.page">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
        <span className="font-display text-xl font-extrabold gold-text tracking-widest">
          CLOSER
        </span>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gold-border gold-text"
              onClick={() => setPage("shop-owner")}
              data-ocid="customer.go_to_office_button"
            >
              <Store className="w-4 h-4 mr-1" />
              My Office
            </Button>
          )}
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" /> My Orders ({myOrders.length})
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        <Tabs defaultValue="browse">
          <TabsList
            className="w-full rounded-full mb-6"
            data-ocid="customer.tab"
          >
            <TabsTrigger value="browse" className="flex-1 rounded-full">
              Browse Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 rounded-full">
              My Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="customer.search_input"
                placeholder="Search products, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>

            {productsLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="customer.products_loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin gold-text" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="customer.products_empty_state"
              >
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((p, i) => (
                  <motion.div
                    key={p.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    data-ocid={`customer.product.item.${i + 1}`}
                  >
                    <ProductCard
                      product={p}
                      shops={shops}
                      onOrder={() => setOrderProduct(p)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="customer.orders_loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin gold-text" />
              </div>
            ) : myOrders.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="customer.orders_empty_state"
              >
                No orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myOrders.map((o, i) => (
                  <motion.div
                    key={o.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    data-ocid={`customer.order.item.${i + 1}`}
                  >
                    <OrderCard order={o} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Order Dialog */}
      <Dialog
        open={!!orderProduct}
        onOpenChange={(v) => !v && setOrderProduct(null)}
      >
        <DialogContent
          className="bg-card border-border rounded-2xl"
          data-ocid="customer.order.dialog"
        >
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
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
                  className="rounded-xl"
                  data-ocid="customer.quantity_input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full gold-border gold-text"
                  onClick={() => setOrderProduct(null)}
                  data-ocid="customer.order.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-full"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  data-ocid="customer.order.confirm_button"
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
