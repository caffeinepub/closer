import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  MessageSquare,
  Upload,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Order, Shop } from "../backend";
import {
  useAllProducts,
  useAllShops,
  useMyOrders,
  useUpdatePaymentNote,
  useUpdatePaymentProof,
} from "../hooks/useQueries";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: { label: "Inasubiri", icon: Clock, color: "hsl(45,90%,55%)" },
  confirmed: {
    label: "Imethibitishwa",
    icon: CheckCircle,
    color: "hsl(120,50%,45%)",
  },
  delivered: {
    label: "Imetolewa",
    icon: CheckCircle,
    color: "hsl(200,70%,50%)",
  },
  cancelled: { label: "Imeghairiwa", icon: XCircle, color: "hsl(0,70%,50%)" },
};

function OrderCard({
  order,
  shopName,
  productName,
  shop,
}: { order: Order; shopName: string; productName: string; shop?: Shop }) {
  const uploadProof = useUpdatePaymentProof();
  const updateNote = useUpdatePaymentNote();
  const fileRef = useRef<HTMLInputElement>(null);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadProof.mutate(
      { orderId: order.id, file, paymentNote: "" },
      {
        onSuccess: () => toast.success("Uthibitisho umepakiwa!"),
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const handleNoteSubmit = () => {
    if (!noteText.trim()) return;
    updateNote.mutate(
      { orderId: order.id, paymentNote: noteText.trim() },
      {
        onSuccess: () => {
          toast.success("Ujumbe wako umehifadhiwa!");
          setNoteText("");
          setShowNoteInput(false);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const commission = Number(order.commissionAmount);
  const total = Number(order.totalPrice);
  const needsPayment =
    order.paymentStatus !== "confirmed" && order.status !== "cancelled";
  const isPending = uploadProof.isPending || updateNote.isPending;

  return (
    <div
      className="rounded-xl p-4 border space-y-3"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm"
            style={{ color: "hsl(var(--card-foreground))" }}
          >
            {productName}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {shopName}
          </p>
          {(order.customerName || order.customerPhone) && (
            <p className="text-xs mt-0.5" style={{ color: "hsl(200,70%,60%)" }}>
              ud83dudccc {order.customerName}
              {order.customerPhone ? ` u2022 ${order.customerPhone}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1" style={{ color: cfg.color }}>
          <Icon size={14} />
          <span className="text-xs font-medium">{cfg.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div
          className="rounded-lg p-2 text-center"
          style={{ background: "hsl(var(--muted))" }}
        >
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Idadi</p>
          <p
            className="font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {Number(order.quantity)}
          </p>
        </div>
        <div
          className="rounded-lg p-2 text-center"
          style={{ background: "hsl(var(--muted))" }}
        >
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Jumla</p>
          <p
            className="font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            TZS {total.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-lg p-2 text-center"
          style={{ background: "hsl(var(--muted))" }}
        >
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Komisho</p>
          <p className="font-semibold" style={{ color: "hsl(45,90%,55%)" }}>
            TZS {commission.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment section - show when payment not confirmed */}
      {needsPayment && (
        <div
          className="rounded-xl p-3 space-y-3 border"
          style={{
            background: "hsl(45,90%,55% / 0.08)",
            borderColor: "hsl(45,90%,55% / 0.3)",
          }}
          data-ocid="orders.payment.panel"
        >
          {/* Payment numbers from shop */}
          {shop?.paymentNumbers && (
            <div>
              <p
                className="text-xs font-bold mb-1"
                style={{ color: "hsl(45,90%,45%)" }}
              >
                💳 Lipa Hapa / Pay Here
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {shop.paymentNumbers}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Kiasi: TZS {total.toLocaleString()}
              </p>
            </div>
          )}

          {/* Proof status */}
          {order.paymentProof ? (
            <p className="text-xs" style={{ color: "hsl(120,50%,45%)" }}>
              ✓ Uthibitisho wa picha umepakiwa
            </p>
          ) : null}
          {order.paymentNote ? (
            <p
              className="text-xs rounded-lg px-2 py-1"
              style={{
                background: "hsl(var(--muted))",
                color: "hsl(var(--foreground))",
              }}
            >
              <span style={{ color: "hsl(var(--muted-foreground))" }}>
                Ujumbe:{" "}
              </span>
              {order.paymentNote}
            </p>
          ) : null}

          {/* Upload image */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          {!showNoteInput ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={isPending}
                data-ocid="orders.upload.upload_button"
                className="flex-1 text-xs"
              >
                <Upload size={13} className="mr-1" />
                Pakia Picha
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNoteInput(true)}
                data-ocid="orders.note.secondary_button"
                className="flex-1 text-xs"
              >
                <MessageSquare size={13} className="mr-1" />
                Andika Ujumbe
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Mfano: Nilituma TZS 5,000 via M-Pesa ref: ABC123"
                rows={2}
                className="text-xs"
                data-ocid="orders.note.textarea"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNoteInput(false)}
                  data-ocid="orders.note.cancel_button"
                  className="flex-1 text-xs"
                >
                  Ghairi
                </Button>
                <Button
                  size="sm"
                  onClick={handleNoteSubmit}
                  disabled={isPending || !noteText.trim()}
                  data-ocid="orders.note.submit_button"
                  className="flex-1 text-xs"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  {updateNote.isPending ? "Inatuma..." : "Tuma Ujumbe"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment confirmed badge */}
      {order.paymentStatus === "confirmed" && (
        <div
          className="flex items-center gap-1 text-xs rounded-lg px-2 py-1"
          style={{
            background: "hsl(120,50%,45% / 0.12)",
            color: "hsl(120,50%,35%)",
          }}
        >
          <CheckCircle size={12} />
          <span>Malipo yamethibitishwa</span>
        </div>
      )}
    </div>
  );
}

export function CustomerDashboard() {
  const { data: orders, isLoading } = useMyOrders();
  const { data: shops } = useAllShops();
  const { data: products } = useAllProducts();

  const getShop = (shopId: bigint) => shops?.find((s) => s.id === shopId);
  const getShopName = (shopId: bigint) =>
    getShop(shopId)?.name || `Duka #${shopId}`;
  const getProductName = (productId: bigint) =>
    products?.find((p) => p.id === productId)?.name || `Bidhaa #${productId}`;

  const grouped = {
    active: (orders || []).filter((o) =>
      ["pending", "confirmed"].includes(o.status),
    ),
    delivered: (orders || []).filter((o) => o.status === "delivered"),
    cancelled: (orders || []).filter((o) => o.status === "cancelled"),
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "hsl(var(--background))" }}
    >
      <div
        className="px-4 pt-4 pb-3 sticky top-0 z-10"
        style={{
          background: "hsl(var(--background))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Maagizo Yangu
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {orders?.length || 0} maagizo yote
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-20">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-32 rounded-xl"
              data-ocid="orders.loading_state"
            />
          ))
        ) : (orders || []).length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-ocid="orders.empty_state"
          >
            <ClipboardList
              size={40}
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Bado hujafanya agizo lolote
            </p>
          </div>
        ) : (
          <>
            {grouped.active.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Yanayoendelea ({grouped.active.length})
                </p>
                <div className="space-y-3">
                  {grouped.active.map((o) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shop={getShop(o.shopId)}
                    />
                  ))}
                </div>
              </div>
            )}
            {grouped.delivered.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Zilizotolewa ({grouped.delivered.length})
                </p>
                <div className="space-y-3">
                  {grouped.delivered.map((o) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shop={getShop(o.shopId)}
                    />
                  ))}
                </div>
              </div>
            )}
            {grouped.cancelled.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Zilizoghairiwa ({grouped.cancelled.length})
                </p>
                <div className="space-y-3">
                  {grouped.cancelled.map((o) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shop={getShop(o.shopId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
