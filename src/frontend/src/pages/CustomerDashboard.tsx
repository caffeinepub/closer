import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend";
import {
  useAllProducts,
  useAllShops,
  useMyOrders,
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

function PaymentStatusBadge({ paymentStatus }: { paymentStatus: string }) {
  if (paymentStatus === "confirmed") {
    return (
      <div
        className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium"
        style={{ background: "hsl(142,60%,94%)", color: "hsl(142,60%,30%)" }}
        data-ocid="orders.payment.success_state"
      >
        <CheckCircle size={13} />
        <span>Malipo yamethibitishwa</span>
      </div>
    );
  }
  if (paymentStatus === "rejected") {
    return (
      <div
        className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium"
        style={{ background: "hsl(0,90%,95%)", color: "hsl(0,70%,40%)" }}
        data-ocid="orders.payment.error_state"
      >
        <XCircle size={13} />
        <span>Malipo yamekataliwa — lipa tena</span>
      </div>
    );
  }
  if (paymentStatus === "pending") {
    return (
      <div
        className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-medium"
        style={{ background: "hsl(45,90%,95%)", color: "hsl(35,80%,35%)" }}
        data-ocid="orders.payment.loading_state"
      >
        <Clock size={13} />
        <span>Uthibitisho unakaguliwa...</span>
      </div>
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
  isUploading,
}: {
  order: Order;
  shopName: string;
  productName: string;
  shopPaymentNumbers: string;
  uploadProof: (orderId: bigint, file: File | null, note: string) => void;
  isUploading: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const total = Number(order.totalPrice);
  const [showUpload, setShowUpload] = useState(false);
  const [proofNote, setProofNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canUpload =
    order.paymentStatus !== "confirmed" && order.paymentStatus !== "rejected";
  const hasProofPending =
    order.paymentStatus === "pending" &&
    (order.paymentProof || order.paymentNote);

  const handleSubmitProof = () => {
    if (!selectedFile && !proofNote.trim()) {
      toast.error("Andika maandishi au chagua picha ya uthibitisho");
      return;
    }
    uploadProof(order.id, selectedFile, proofNote);
    setShowUpload(false);
    setSelectedFile(null);
    setProofNote("");
  };

  return (
    <div
      className="rounded-xl p-4 border space-y-3"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* Order header */}
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
        </div>
        <div className="flex items-center gap-1" style={{ color: cfg.color }}>
          <Icon size={14} />
          <span className="text-xs font-medium">{cfg.label}</span>
        </div>
      </div>

      {/* Quantity & Total */}
      <div className="grid grid-cols-2 gap-2 text-xs">
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
      </div>

      {/* Shop payment number */}
      {shopPaymentNumbers && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
          style={{ background: "hsl(142,60%,94%)", color: "hsl(142,50%,28%)" }}
          data-ocid="orders.payment.card"
        >
          <span className="text-sm">💳</span>
          <span>Lipa kwa: {shopPaymentNumbers}</span>
        </div>
      )}

      {/* Payment status */}
      <PaymentStatusBadge paymentStatus={order.paymentStatus} />

      {/* Upload proof section */}
      {canUpload && !hasProofPending && (
        <div>
          {showUpload ? (
            <div
              className="space-y-2 rounded-xl p-3 border"
              style={{
                background: "hsl(var(--muted))",
                borderColor: "hsl(var(--border))",
              }}
              data-ocid="orders.proof.panel"
            >
              <p
                className="text-xs font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                📎 Tuma Uthibitisho wa Malipo
              </p>
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Pakia picha AU andika maandishi ya uthibitisho
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                data-ocid="orders.proof.upload_button"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed py-2 text-xs"
                style={{
                  borderColor: selectedFile
                    ? "hsl(142,60%,45%)"
                    : "hsl(var(--border))",
                  color: selectedFile
                    ? "hsl(142,60%,35%)"
                    : "hsl(var(--muted-foreground))",
                  background: "hsl(var(--background))",
                }}
                data-ocid="orders.proof.dropzone"
              >
                {selectedFile
                  ? `✅ ${selectedFile.name}`
                  : "Gusa kuchagua picha"}
              </button>
              <Input
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Nambari ya muamala, neno la uthibitisho..."
                className="text-xs h-8"
                data-ocid="orders.proof.input"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={handleSubmitProof}
                  disabled={isUploading || (!selectedFile && !proofNote.trim())}
                  style={{
                    background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
                    color: "#fff",
                  }}
                  data-ocid="orders.proof.submit_button"
                >
                  {isUploading ? (
                    <Loader2 size={12} className="animate-spin mr-1" />
                  ) : null}
                  Tuma
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedFile(null);
                    setProofNote("");
                  }}
                  data-ocid="orders.proof.cancel_button"
                >
                  Ghairi
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 gap-1.5"
              onClick={() => setShowUpload(true)}
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
              data-ocid="orders.proof.open_modal_button"
            >
              📎 Tuma Uthibitisho wa Malipo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function CustomerDashboard() {
  const { data: orders, isLoading } = useMyOrders();
  const { data: shops } = useAllShops();
  const { data: products } = useAllProducts();
  const uploadProofMutation = useUpdatePaymentProof();

  const getShopName = (shopId: bigint) =>
    shops?.find((s) => s.id === shopId)?.name || `Duka #${shopId}`;
  const getProductName = (productId: bigint) =>
    products?.find((p) => p.id === productId)?.name || `Bidhaa #${productId}`;
  const getShopPaymentNumbers = (shopId: bigint) =>
    shops?.find((s) => s.id === shopId)?.paymentNumbers || "";

  const handleUploadProof = (
    orderId: bigint,
    file: File | null,
    note: string,
  ) => {
    uploadProofMutation.mutate(
      { orderId, file, paymentNote: note },
      {
        onSuccess: () => toast.success("Uthibitisho umetumwa kwa mafanikio!"),
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

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
                  {grouped.active.map((o, i) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shopPaymentNumbers={getShopPaymentNumbers(o.shopId)}
                      uploadProof={handleUploadProof}
                      isUploading={uploadProofMutation.isPending}
                      data-ocid={`orders.item.${i + 1}`}
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
                  {grouped.delivered.map((o, i) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shopPaymentNumbers={getShopPaymentNumbers(o.shopId)}
                      uploadProof={handleUploadProof}
                      isUploading={uploadProofMutation.isPending}
                      data-ocid={`orders.delivered.item.${i + 1}`}
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
                  {grouped.cancelled.map((o, i) => (
                    <OrderCard
                      key={o.id.toString()}
                      order={o}
                      shopName={getShopName(o.shopId)}
                      productName={getProductName(o.productId)}
                      shopPaymentNumbers={getShopPaymentNumbers(o.shopId)}
                      uploadProof={handleUploadProof}
                      isUploading={uploadProofMutation.isPending}
                      data-ocid={`orders.cancelled.item.${i + 1}`}
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
