import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Loader2,
  RefreshCw,
  Settings,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAppSettings,
  useApproveSubscriptionReference,
  usePendingReferences,
  useRejectSubscriptionReference,
  useUpdateAppSettings,
} from "../hooks/useQueries";

function formatDate(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPanel() {
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useAppSettings();
  const {
    data: pendingRefs,
    isLoading: refsLoading,
    refetch: refetchRefs,
  } = usePendingReferences();
  const updateSettings = useUpdateAppSettings();
  const approve = useApproveSubscriptionReference();
  const reject = useRejectSubscriptionReference();

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

  const handleApprove = (id: bigint) => {
    approve.mutate(id, {
      onSuccess: () => {
        toast.success("Imeidhinishwa!");
        refetchRefs();
      },
      onError: () => toast.error("Hitilafu — jaribu tena"),
    });
  };

  const handleReject = (id: bigint) => {
    reject.mutate(id, {
      onSuccess: () => {
        toast.success("Imekataliwa");
        refetchRefs();
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

      {/* App Settings */}
      <div className="px-4 mb-6">
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
                  Namba ya Malipo ya Platform / Platform Payment Number
                </Label>
                {editingPayment ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      placeholder="M-Pesa: +255700000000"
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
                        background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
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
                        setPaymentNumber(settings?.platformPaymentNumber || "");
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
      </div>

      {/* Pending References */}
      <div className="px-4">
        <div
          className="rounded-2xl border"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-2">
              <h2
                className="font-bold text-base"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Malipo Yanayosubiri / Pending References
              </h2>
              {pendingRefs && pendingRefs.length > 0 && (
                <Badge
                  style={{
                    background: "hsl(0,70%,50%)",
                    color: "#fff",
                  }}
                  data-ocid="admin.pending_count.badge"
                >
                  {pendingRefs.length}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchRefs()}
              data-ocid="admin.pending_refs.refresh_button"
            >
              <RefreshCw size={14} className="mr-1" />
              Onyesha upya
            </Button>
          </div>

          {refsLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : !pendingRefs || pendingRefs.length === 0 ? (
            <div
              className="text-center py-10"
              data-ocid="admin.pending_refs.empty_state"
            >
              <CheckCircle
                size={32}
                className="mx-auto mb-2"
                style={{ color: "hsl(120,50%,45%)" }}
              />
              <p
                className="text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Hakuna malipo yanayosubiri
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Duka</TableHead>
                    <TableHead>Mmiliki</TableHead>
                    <TableHead>Ref #</TableHead>
                    <TableHead>Tarehe</TableHead>
                    <TableHead>Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRefs.map((ref, i) => (
                    <TableRow
                      key={ref.id.toString()}
                      data-ocid={`admin.pending_ref.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-sm">
                        {ref.shopName}
                      </TableCell>
                      <TableCell className="text-sm">{ref.ownerName}</TableCell>
                      <TableCell>
                        <code
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {ref.referenceNumber}
                        </code>
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {formatDate(ref.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(ref.id)}
                            disabled={approve.isPending}
                            style={{
                              background: "hsl(120,50%,40%)",
                              color: "#fff",
                            }}
                            data-ocid={`admin.approve_ref.primary_button.${i + 1}`}
                          >
                            <CheckCircle size={13} className="mr-1" />
                            Idhinisha
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(ref.id)}
                            disabled={reject.isPending}
                            style={{
                              color: "hsl(0,70%,50%)",
                              borderColor: "hsl(0,70%,50%)",
                            }}
                            data-ocid={`admin.reject_ref.delete_button.${i + 1}`}
                          >
                            <XCircle size={13} className="mr-1" />
                            Kataa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
