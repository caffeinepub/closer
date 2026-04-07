import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CheckCircle,
  Loader2,
  Package,
  RefreshCw,
  Settings,
  ShoppingBag,
  Store,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, Product, Shop, UserProfile } from "../backend";
import {
  useAllOrdersAdmin,
  useAllProducts,
  useAllShops,
  useAllUserProfiles,
  useAppSettings,
  useConfirmPayment,
  useRejectPayment,
  useUpdateAppSettings,
} from "../hooks/useQueries";

function formatTZS(amount: bigint | number): string {
  return `TZS ${Number(amount).toLocaleString()}`;
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <Badge
      className="ml-1 text-xs px-1.5 py-0 h-5 min-w-5"
      style={{
        background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
        color: "#fff",
      }}
    >
      {count}
    </Badge>
  );
}

function SectionHeader({
  title,
  subtitle,
  onRefresh,
}: {
  title: string;
  subtitle: string;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2
          className="font-bold text-base"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {title}
        </h2>
        <p
          className="text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {subtitle}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        data-ocid="admin.refresh_button"
      >
        <RefreshCw size={14} className="mr-1" />
        Onyesha upya
      </Button>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-3" data-ocid="admin.loading_state">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: { icon: React.ReactNode; message: string }) {
  return (
    <div className="text-center py-16" data-ocid="admin.empty_state">
      <div
        className="flex justify-center mb-3"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {icon}
      </div>
      <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
        {message}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span style={{ color: "hsl(var(--muted-foreground))" }}>{label}:</span>
      <span
        className="font-medium truncate"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UserCard({
  entry,
  idx,
}: {
  entry: [Principal, UserProfile];
  idx: number;
}) {
  const [, profile] = entry;
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-xl p-3 flex items-start gap-3"
      style={{
        background: "hsl(var(--card))",
      }}
      data-ocid={`admin.users.item.${idx + 1}`}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{
          background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
          color: "#fff",
        }}
      >
        {initials || "?"}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {profile.name || "(Jina halijawekwa)"}
        </p>
        <InfoRow label="📞" value={profile.phone || "—"} />
        <InfoRow label="✉️" value={profile.email || "—"} />
      </div>
    </div>
  );
}

// ─── Shops Tab ────────────────────────────────────────────────────────────────

function ShopCard({ shop, idx }: { shop: Shop; idx: number }) {
  return (
    <div
      className="rounded-xl p-3 space-y-1.5"
      style={{
        background: "hsl(var(--card))",
      }}
      data-ocid={`admin.shops.item.${idx + 1}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: "hsl(var(--foreground))" }}
        >
          🏪 {shop.name}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          {shop.isActive && (
            <span
              className="w-2 h-2 rounded-full bg-green-500 inline-block"
              title="Active"
            />
          )}
          <Badge
            variant="outline"
            className="text-xs px-1.5 py-0 h-5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {shop.isActive ? "Wazi" : "Imefungwa"}
          </Badge>
        </div>
      </div>
      <InfoRow label="Kundi" value={(shop as any).category || "—"} />
      <InfoRow label="Anwani" value={shop.address || "—"} />
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductCard({ product, idx }: { product: Product; idx: number }) {
  return (
    <div
      className="rounded-xl p-3 space-y-1.5"
      style={{
        background: "hsl(var(--card))",
      }}
      data-ocid={`admin.products.item.${idx + 1}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: "hsl(var(--foreground))" }}
        >
          📦 {product.name}
        </p>
        <span
          className="font-bold text-sm shrink-0"
          style={{ color: "hsl(var(--primary))" }}
        >
          {formatTZS(product.price)}
        </span>
      </div>
      <InfoRow label="Aina" value={product.category || "—"} />
      <InfoRow label="Stoo" value={Number(product.stock).toString()} />
      <InfoRow label="Duka #" value={product.shopId.toString()} />
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
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

  return (
    <Badge style={{ background: bg, color }} className="text-xs">
      {label}
    </Badge>
  );
}

function PaymentStatusBadge({ paymentStatus }: { paymentStatus: string }) {
  const s = (paymentStatus || "").toLowerCase();

  if (s === "confirmed") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium"
        style={{ background: "hsl(142,60%,94%)", color: "hsl(142,60%,28%)" }}
        data-ocid="admin.payment.success_state"
      >
        <CheckCircle size={11} /> Malipo yamethibitishwa
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium"
        style={{ background: "hsl(0,90%,95%)", color: "hsl(0,70%,38%)" }}
        data-ocid="admin.payment.error_state"
      >
        <XCircle size={11} /> Yamekataliwa
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium"
        style={{ background: "hsl(45,90%,92%)", color: "hsl(35,80%,30%)" }}
        data-ocid="admin.payment.loading_state"
      >
        ⏳ Inangoja ukaguzi
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5"
      style={{
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      💸 Hajalipwa
    </span>
  );
}

function AdminOrderCard({
  order,
  idx,
  onConfirmPayment,
  onRejectPayment,
  isConfirming,
  products,
  shops,
}: {
  order: Order;
  idx: number;
  onConfirmPayment: (orderId: bigint) => void;
  onRejectPayment: (orderId: bigint) => void;
  isConfirming?: boolean;
  products: Product[];
  shops: Shop[];
}) {
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  // Resolve proof image URL from ExternalBlob
  const proofBlob = order.paymentProof;
  if (proofBlob && !proofUrl) {
    try {
      const url = proofBlob.getDirectURL();
      if (url) setProofUrl(url);
    } catch {
      // ignore
    }
  }

  const isPending = (order.paymentStatus || "").toLowerCase() === "pending";

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{
        background: "hsl(var(--card))",
      }}
      data-ocid={`admin.orders.item.${idx + 1}`}
    >
      {/* Customer info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "hsl(var(--foreground))" }}
          >
            👤 {order.customerName || "(Jina halijawekwa)"}
          </p>
          {order.customerPhone && (
            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              📞 {order.customerPhone}
            </p>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order details */}
      <div className="flex items-center justify-between">
        <div className="text-xs space-y-0.5">
          <InfoRow label="Agizo #" value={order.id.toString()} />
          <InfoRow
            label="Bidhaa"
            value={
              products.find((p) => p.id === order.productId)?.name ||
              `Bidhaa #${order.productId.toString()}`
            }
          />
          <InfoRow
            label="Duka"
            value={
              shops.find((s) => s.id === order.shopId)?.name ||
              `Duka #${order.shopId.toString()}`
            }
          />
          <InfoRow label="Idadi" value={Number(order.quantity).toString()} />
        </div>
        <div className="text-right space-y-0.5">
          <span
            className="block font-bold text-sm"
            style={{ color: "hsl(var(--primary))" }}
          >
            {formatTZS(order.totalPrice)}
          </span>
          {Number(order.commissionAmount) > 0 && (
            <span
              className="block text-xs font-medium"
              style={{ color: "hsl(25,80%,50%)" }}
            >
              Komisho: {formatTZS(order.commissionAmount)}
            </span>
          )}
        </div>
      </div>

      {/* Payment status badge */}
      <div className="flex flex-wrap items-center gap-2">
        <PaymentStatusBadge paymentStatus={order.paymentStatus} />
      </div>

      {/* Payment note */}
      {!proofUrl && order.paymentNote && (
        <div
          className="rounded-lg px-3 py-2 text-xs font-medium"
          style={{
            background: "hsl(45,90%,95%)",
            color: "hsl(35,80%,35%)",
            border: "1px solid hsl(45,80%,80%)",
          }}
        >
          📝 Uthibitisho wa maandishi: {order.paymentNote}
        </div>
      )}
      {proofUrl && order.paymentNote && (
        <p
          className="text-xs rounded-lg px-2 py-1"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          📝 {order.paymentNote}
        </p>
      )}

      {/* Payment proof thumbnail */}
      {proofUrl && (
        <div className="flex items-center gap-2">
          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            title="Angalia picha kamili"
          >
            <img
              src={proofUrl}
              alt="Uthibitisho wa malipo"
              className="w-16 h-16 rounded-lg object-cover border"
              style={{ borderColor: "hsl(var(--border))" }}
            />
          </a>
          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs underline"
            style={{ color: "hsl(var(--primary))" }}
          >
            Angalia ukubwa kamili
          </a>
        </div>
      )}

      {/* Confirm / Reject buttons — only when proof is pending */}
      {isPending && (proofBlob || order.paymentNote) && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 text-xs h-8 gap-1"
            onClick={() => onConfirmPayment(order.id)}
            disabled={isConfirming}
            style={{ background: "hsl(142,60%,40%)", color: "#fff" }}
            data-ocid={`admin.orders.confirm_button.${idx + 1}`}
          >
            {isConfirming ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <CheckCircle size={12} />
            )}
            Thibitisha
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs h-8 gap-1"
            onClick={() => onRejectPayment(order.id)}
            disabled={isConfirming}
            style={{ background: "hsl(0,70%,50%)", color: "#fff" }}
            data-ocid={`admin.orders.delete_button.${idx + 1}`}
          >
            {isConfirming ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <XCircle size={12} />
            )}
            Kataa
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminPanel() {
  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useAllUserProfiles();

  const {
    data: shops,
    isLoading: shopsLoading,
    refetch: refetchShops,
  } = useAllShops();

  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useAllProducts();

  const {
    data: allOrders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useAllOrdersAdmin();

  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useAppSettings();

  const updateSettings = useUpdateAppSettings();
  const confirmPayment = useConfirmPayment();
  const rejectPayment = useRejectPayment();
  const [paymentNumber, setPaymentNumber] = useState("");
  const [editingPayment, setEditingPayment] = useState(false);

  const handleSaveSettings = () => {
    if (!paymentNumber.trim()) {
      toast.error("Ingiza namba ya mawasiliano");
      return;
    }
    updateSettings.mutate(paymentNumber.trim(), {
      onSuccess: () => {
        toast.success("Mipangilio imehifadhiwa!");
        setEditingPayment(false);
        refetchSettings();
      },
      onError: () => toast.error("Hitilafu — jaribu tena"),
    });
  };

  const handleConfirmPayment = (orderId: bigint) => {
    confirmPayment.mutate(orderId, {
      onSuccess: () => {
        toast.success("Malipo yamethibitishwa!");
        refetchOrders();
      },
      onError: () => toast.error("Hitilafu — jaribu tena"),
    });
  };

  const handleRejectPayment = (orderId: bigint) => {
    rejectPayment.mutate(orderId, {
      onSuccess: () => {
        toast.success("Malipo yamekataliwa.");
        refetchOrders();
      },
      onError: () => toast.error("Hitilafu — jaribu tena"),
    });
  };

  const userCount = users?.length ?? 0;
  const shopCount = shops?.length ?? 0;
  const productCount = products?.length ?? 0;
  const orderCount = allOrders?.length ?? 0;

  return (
    <div
      className="flex-1 overflow-y-auto pb-24"
      style={{ background: "hsl(var(--background))" }}
      data-ocid="admin.panel"
    >
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.25 0.08 260), oklch(0.2 0.1 310))",
        }}
      >
        <h1 className="text-xl font-bold mb-1 text-white">🛡️ Admin Panel</h1>
        <p className="text-xs text-white/70">
          Usimamizi wa App • Closer to Market
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "Watumiaji", value: userCount, emoji: "👥" },
            { label: "Maduka", value: shopCount, emoji: "🏪" },
            { label: "Bidhaa", value: productCount, emoji: "📦" },
            { label: "Maagizo", value: orderCount, emoji: "🛒" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-2 text-center"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <div className="text-base">{stat.emoji}</div>
              <div className="text-lg font-bold text-white leading-none">
                {stat.value}
              </div>
              <div className="text-xs text-white/70 mt-0.5 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <Tabs defaultValue="users" data-ocid="admin.tabs">
          <TabsList className="w-full mb-4 overflow-x-auto flex">
            <TabsTrigger
              value="users"
              className="flex-1 flex items-center gap-1 text-xs"
              data-ocid="admin.users.tab"
            >
              <Users size={13} />
              Watumiaji
              <CountBadge count={userCount} />
            </TabsTrigger>
            <TabsTrigger
              value="shops"
              className="flex-1 flex items-center gap-1 text-xs"
              data-ocid="admin.shops.tab"
            >
              <Store size={13} />
              Maduka
              <CountBadge count={shopCount} />
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex-1 flex items-center gap-1 text-xs"
              data-ocid="admin.products.tab"
            >
              <Package size={13} />
              Bidhaa
              <CountBadge count={productCount} />
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 flex items-center gap-1 text-xs"
              data-ocid="admin.orders.tab"
            >
              <ShoppingBag size={13} />
              Maagizo
              <CountBadge count={orderCount} />
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 flex items-center gap-1 text-xs"
              data-ocid="admin.settings.tab"
            >
              <Settings size={13} />
              Mipangilio
            </TabsTrigger>
          </TabsList>

          {/* ── Users ── */}
          <TabsContent value="users" data-ocid="admin.users.panel">
            <SectionHeader
              title="Watumiaji Wote"
              subtitle={`Watumiaji ${userCount} wamesajiliwa`}
              onRefresh={refetchUsers}
            />
            {usersLoading ? (
              <LoadingCards />
            ) : !users || users.length === 0 ? (
              <EmptyState
                icon={<Users size={36} />}
                message="Hakuna watumiaji bado"
              />
            ) : (
              <div className="space-y-3">
                {users.map((entry, i) => (
                  <UserCard key={entry[0].toString()} entry={entry} idx={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Shops ── */}
          <TabsContent value="shops" data-ocid="admin.shops.panel">
            <SectionHeader
              title="Maduka Yote"
              subtitle={`Maduka ${shopCount} yamesajiliwa`}
              onRefresh={refetchShops}
            />
            {shopsLoading ? (
              <LoadingCards />
            ) : !shops || shops.length === 0 ? (
              <EmptyState
                icon={<Store size={36} />}
                message="Hakuna maduka bado"
              />
            ) : (
              <div className="space-y-3">
                {shops.map((shop, i) => (
                  <ShopCard key={shop.id.toString()} shop={shop} idx={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Products ── */}
          <TabsContent value="products" data-ocid="admin.products.panel">
            <SectionHeader
              title="Bidhaa Zote"
              subtitle={`Bidhaa ${productCount} zinapatikana`}
              onRefresh={refetchProducts}
            />
            {productsLoading ? (
              <LoadingCards />
            ) : !products || products.length === 0 ? (
              <EmptyState
                icon={<Package size={36} />}
                message="Hakuna bidhaa bado"
              />
            ) : (
              <div className="space-y-3">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id.toString()}
                    product={product}
                    idx={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Orders ── */}
          <TabsContent value="orders" data-ocid="admin.orders.panel">
            <SectionHeader
              title="Maagizo Yote"
              subtitle={`Maagizo ${orderCount} yamewekwa`}
              onRefresh={refetchOrders}
            />
            {ordersLoading ? (
              <LoadingCards />
            ) : !allOrders || allOrders.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag size={36} />}
                message="Hakuna maagizo bado"
              />
            ) : (
              <div className="space-y-3">
                {[...allOrders].reverse().map((order, i) => (
                  <AdminOrderCard
                    key={order.id.toString()}
                    order={order}
                    idx={i}
                    onConfirmPayment={handleConfirmPayment}
                    onRejectPayment={handleRejectPayment}
                    isConfirming={
                      confirmPayment.isPending || rejectPayment.isPending
                    }
                    products={products || []}
                    shops={shops || []}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Settings ── */}
          <TabsContent value="settings" data-ocid="admin.settings.panel">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "hsl(var(--card))",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings size={18} style={{ color: "hsl(var(--primary))" }} />
                <h2
                  className="font-bold text-base"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Mipangilio ya App
                </h2>
              </div>

              {settingsLoading ? (
                <Skeleton className="h-10 rounded-lg" />
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label style={{ color: "hsl(var(--foreground))" }}>
                      Namba ya Mawasiliano / Contact Number
                    </Label>
                    {editingPayment ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value)}
                          placeholder="+255700000000"
                          className="flex-1"
                          data-ocid="admin.settings.input"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSaveSettings()
                          }
                        />
                        <Button
                          onClick={handleSaveSettings}
                          disabled={updateSettings.isPending}
                          style={{
                            background:
                              "linear-gradient(135deg, #1565C0, #6A1B9A)",
                            color: "#fff",
                          }}
                          data-ocid="admin.settings.save_button"
                        >
                          {updateSettings.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Hifadhi"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingPayment(false)}
                          data-ocid="admin.settings.cancel_button"
                        >
                          Ghairi
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="flex-1 px-3 py-2 rounded-lg text-sm"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {settings?.platformPaymentNumber || "Haijawekwa bado"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPaymentNumber(
                              settings?.platformPaymentNumber || "",
                            );
                            setEditingPayment(true);
                          }}
                          data-ocid="admin.settings.edit_button"
                        >
                          Badilisha
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
