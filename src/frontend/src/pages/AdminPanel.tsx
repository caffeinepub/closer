import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Settings, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend";
import {
  useAllOrdersAdmin,
  useAppSettings,
  useUpdateAppSettings,
} from "../hooks/useQueries";

function formatTZS(amount: bigint | number): string {
  return `TZS ${Number(amount).toLocaleString()}`;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "paid" || s === "imelipwa") {
    return (
      <Badge
        style={{ background: "hsl(142,50%,40%)", color: "#fff" }}
        data-ocid="admin.transaction.paid_status"
      >
        ✅ Imelipwa
      </Badge>
    );
  }
  if (s === "pending" || s === "inasubiri") {
    return (
      <Badge
        style={{ background: "hsl(45,90%,45%)", color: "#fff" }}
        data-ocid="admin.transaction.pending_status"
      >
        ⏳ Inasubiri
      </Badge>
    );
  }
  return (
    <Badge
      style={{
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      }}
      data-ocid="admin.transaction.unpaid_status"
    >
      ❌ Haijalipiwa
    </Badge>
  );
}

function TransactionRow({ order, idx }: { order: Order; idx: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerName = (order as any).customerName || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerPhone = (order as any).customerPhone || "";

  return (
    <div
      className="rounded-xl border p-3 space-y-2"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
      data-ocid={`admin.transaction.item.${idx + 1}`}
    >
      {/* Customer info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "hsl(var(--foreground))" }}
          >
            👤 {customerName || "(Jina halijawekwa)"}
          </p>
          {customerPhone && (
            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              📞 {customerPhone}
            </p>
          )}
        </div>
        <PaymentStatusBadge status={order.status} />
      </div>

      {/* Order details */}
      <div
        className="flex items-center justify-between text-xs"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <span>Agizo #{order.id.toString()}</span>
        <span
          className="font-bold text-sm"
          style={{ color: "hsl(var(--primary))" }}
        >
          {formatTZS(order.totalPrice)}
        </span>
      </div>

      {/* Order quantity */}
      <div
        className="text-xs"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Idadi: {Number(order.quantity)}
      </div>
    </div>
  );
}

export function AdminPanel() {
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useAppSettings();
  const {
    data: allOrders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useAllOrdersAdmin();
  const updateSettings = useUpdateAppSettings();

  const [paymentNumber, setPaymentNumber] = useState("");
  const [editingPayment, setEditingPayment] = useState(false);

  const handleSaveSettings = () => {
    if (!paymentNumber.trim()) {
      toast.error("Ingiza namba ya malipo");
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

  return (
    <div
      className="flex-1 overflow-y-auto pb-24"
      style={{ background: "hsl(var(--background))" }}
      data-ocid="admin.panel"
    >
      <div className="px-4 pt-6 pb-4">
        <h1
          className="text-xl font-bold mb-1"
          style={{ color: "hsl(var(--foreground))" }}
        >
          🛡️ Admin Panel
        </h1>
        <p
          className="text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Usimamizi wa App / App Management
        </p>
      </div>

      <div className="px-4">
        <Tabs defaultValue="transactions" data-ocid="admin.tabs">
          <TabsList className="w-full mb-4">
            <TabsTrigger
              value="transactions"
              className="flex-1 flex items-center gap-2"
              data-ocid="admin.transactions.tab"
            >
              <ShoppingBag size={14} />
              Maagizo
              {allOrders && allOrders.length > 0 && (
                <Badge
                  className="ml-1 text-xs px-1.5 py-0 h-5"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  {allOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 flex items-center gap-2"
              data-ocid="admin.settings.tab"
            >
              <Settings size={14} />
              Mipangilio
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent
            value="transactions"
            data-ocid="admin.transactions.panel"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2
                  className="font-bold text-base"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Maagizo Yote / All Orders
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Orodha ya maagizo na wateja
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchOrders()}
                data-ocid="admin.transactions.refresh_button"
              >
                <RefreshCw size={14} className="mr-1" />
                Onyesha upya
              </Button>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-24 rounded-xl"
                    data-ocid="admin.transactions.loading_state"
                  />
                ))}
              </div>
            ) : !allOrders || allOrders.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="admin.transactions.empty_state"
              >
                <ShoppingBag
                  size={36}
                  className="mx-auto mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Hakuna maagizo bado
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allOrders.map((order, i) => (
                  <TransactionRow
                    key={order.id.toString()}
                    order={order}
                    idx={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" data-ocid="admin.settings.panel">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings size={18} style={{ color: "hsl(var(--primary))" }} />
                <h2
                  className="font-bold text-base"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Mipangilio ya App / App Settings
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
                          data-ocid="admin.payment_number.input"
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
                          data-ocid="admin.payment_number.save_button"
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
                          data-ocid="admin.payment_number.cancel_button"
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
                          data-ocid="admin.payment_number.edit_button"
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
