import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Camera,
  CheckCircle,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Notification, Order, Product, Shop } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { playNotificationSound } from "../utils/sound";

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

function NotificationItem({
  notif,
  onRead,
}: { notif: Notification; onRead: (id: bigint) => void }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border ${
        notif.isRead
          ? "border-border opacity-60"
          : "border-primary bg-primary/5"
      }`}
      data-ocid="owner.notification.card"
    >
      <Bell
        className={`w-4 h-4 mt-0.5 shrink-0 ${notif.isRead ? "text-muted-foreground" : "gold-text"}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{notif.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(Number(notif.timestamp) / 1_000_000).toLocaleString()}
        </p>
      </div>
      {!notif.isRead && (
        <button
          type="button"
          onClick={() => onRead(notif.id)}
          className="text-xs gold-text hover:underline"
          data-ocid="owner.mark_read_button"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

type TabValue = "shop" | "products" | "orders" | "notifications";

export default function ShopOwnerDashboard() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  const prevUnreadRef = useRef(0);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabValue>("shop");

  const principal = identity?.getPrincipal().toString();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (!principal) return null;
    return localStorage.getItem(`avatar_${principal}`) || null;
  });

  useEffect(() => {
    if (principal) {
      setAvatarUrl(localStorage.getItem(`avatar_${principal}`) || null);
    }
  }, [principal]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !principal) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem(`avatar_${principal}`, dataUrl);
      setAvatarUrl(dataUrl);
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  }

  const [shopForm, setShopForm] = useState({
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    tiktok: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [deletingShop, setDeletingShop] = useState(false);

  const [prodForm, setProdForm] = useState({
    name: "",
    price: "",
  });
  const [prodImage, setProdImage] = useState<File | null>(null);
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [savingProd, setSavingProd] = useState(false);

  const { data: myShops = [], isLoading: shopsLoading } = useQuery<Shop[]>({
    queryKey: ["allShops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShops();
    },
    enabled: !!actor && !isFetching,
  });

  const myShop: Shop | undefined = myShops[0];

  const { data: shopProducts = [] } = useQuery<Product[]>({
    queryKey: ["shopProducts", myShop?.id?.toString()],
    queryFn: async () => {
      if (!actor || !myShop) return [];
      return actor.getShopProducts(myShop.id);
    },
    enabled: !!actor && !!myShop && !isFetching,
  });

  const { data: shopOrders = [] } = useQuery<Order[]>({
    queryKey: ["shopOrders", myShop?.id?.toString()],
    queryFn: async () => {
      if (!actor || !myShop) return [];
      return actor.getShopOrders(myShop.id);
    },
    enabled: !!actor && !!myShop && !isFetching,
    refetchInterval: 30000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["myNotifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    if (unread > prevUnreadRef.current && prevUnreadRef.current !== -1) {
      playNotificationSound();
      toast.info(`${unread - prevUnreadRef.current} new notification(s)!`);
    }
    prevUnreadRef.current = unread;
  }, [notifications]);

  useEffect(() => {
    if (notifications.length > 0 && prevUnreadRef.current === -1) {
      prevUnreadRef.current = notifications.filter((n) => !n.isRead).length;
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleMarkRead(id: bigint) {
    if (!actor) return;
    await actor.markNotificationAsRead(id);
    qc.invalidateQueries({ queryKey: ["myNotifications"] });
  }

  async function handleCreateShop() {
    if (!actor) return;
    setSavingShop(true);
    try {
      await actor.createShop(
        shopForm.name,
        shopForm.description,
        shopForm.address,
        Number.parseFloat(shopForm.latitude) || 0,
        Number.parseFloat(shopForm.longitude) || 0,
        shopForm.tiktok,
        shopForm.whatsapp,
        shopForm.instagram,
        shopForm.facebook,
      );
      toast.success("Shop created!");
      qc.invalidateQueries({ queryKey: ["allShops"] });
      setShopDialogOpen(false);
    } catch {
      toast.error("Failed to create shop");
    } finally {
      setSavingShop(false);
    }
  }

  async function handleDeleteShop() {
    if (!actor || !myShop) return;
    setDeletingShop(true);
    try {
      await (actor as any).deleteShop(myShop.id);
      toast.success("Shop deleted");
      qc.invalidateQueries({ queryKey: ["allShops"] });
    } catch {
      toast.error("Failed to delete shop");
    } finally {
      setDeletingShop(false);
    }
  }

  async function handleCreateProduct() {
    if (!actor || !myShop) return;
    setSavingProd(true);
    try {
      let imageBlob: ExternalBlob;
      if (prodImage) {
        const bytes = new Uint8Array(await prodImage.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(bytes);
      } else {
        imageBlob = ExternalBlob.fromBytes(new Uint8Array());
      }
      await actor.createProduct(
        prodForm.name,
        "",
        BigInt(Math.round(Number.parseFloat(prodForm.price || "0") * 100)),
        "",
        imageBlob,
        BigInt(0),
        myShop.id,
      );
      toast.success("Product added!");
      qc.invalidateQueries({
        queryKey: ["shopProducts", myShop.id.toString()],
      });
      setProdDialogOpen(false);
      setProdForm({ name: "", price: "" });
      setProdImage(null);
    } catch {
      toast.error("Failed to create product");
    } finally {
      setSavingProd(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: bigint, status: string) {
    if (!actor) return;
    try {
      await actor.updateOrderStatus(orderId, status);
      toast.success(`Order ${status}!`);
      qc.invalidateQueries({
        queryKey: ["shopOrders", myShop?.id?.toString()],
      });
    } catch {
      toast.error("Failed to update order");
    }
  }

  // Shared Add Product Dialog trigger
  function AddProductButton({ label = "Add Product" }: { label?: string }) {
    return (
      <Dialog open={prodDialogOpen} onOpenChange={setProdDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full"
            disabled={!myShop}
            data-ocid="owner.add_product_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="bg-card border-border rounded-2xl"
          data-ocid="owner.add_product_dialog"
        >
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Product Name *</Label>
              <Input
                data-ocid="owner.product_name_input"
                value={prodForm.name}
                onChange={(e) =>
                  setProdForm((p) => ({ ...p, name: e.target.value }))
                }
                className="rounded-xl"
                placeholder="e.g. Fresh Bread"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Price ($)</Label>
              <Input
                data-ocid="owner.product_price_input"
                value={prodForm.price}
                onChange={(e) =>
                  setProdForm((p) => ({ ...p, price: e.target.value }))
                }
                className="rounded-xl"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5.99"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Product Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProdImage(e.target.files?.[0] || null)}
                data-ocid="owner.product_image_input"
                className="rounded-xl"
              />
              {prodImage && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {prodImage.name}
                </p>
              )}
            </div>
            <Button
              className="rounded-full"
              onClick={handleCreateProduct}
              disabled={savingProd || !prodForm.name || !myShop}
              data-ocid="owner.add_product_submit_button"
            >
              {savingProd ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {savingProd ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const navItems: { value: TabValue; icon: React.ReactNode; label: string }[] =
    [
      { value: "shop", icon: <Store className="w-6 h-6" />, label: "My Shop" },
      {
        value: "products",
        icon: <Package className="w-6 h-6" />,
        label: "Products",
      },
      {
        value: "orders",
        icon: <ShoppingBag className="w-6 h-6" />,
        label: "Orders",
      },
      {
        value: "notifications",
        icon: (
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        ),
        label: "Alerts",
      },
    ];

  return (
    <div className="min-h-screen flex flex-col" data-ocid="owner.page">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
        <span className="font-display text-xl font-extrabold gold-text tracking-widest">
          CLOSER
        </span>
        <div className="flex items-center gap-3">
          {/* Quick Add Product button — always visible when there's a shop */}
          {myShop && <AddProductButton label="+ Product" />}
          <button
            type="button"
            onClick={() => avatarFileRef.current?.click()}
            className="relative w-9 h-9 rounded-full border-2 border-border hover:border-primary transition-colors overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
            title="Update profile photo"
            data-ocid="owner.avatar_button"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-4 h-4 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </button>
          <input
            ref={avatarFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            data-ocid="owner.avatar_file_input"
          />
          <span className="text-sm text-muted-foreground hidden sm:block">
            Shop Owner
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 max-w-5xl mx-auto w-full">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
        >
          {/* Shop Tab */}
          <TabsContent value="shop">
            {shopsLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="owner.shop_loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin gold-text" />
              </div>
            ) : !myShop ? (
              <div
                className="text-center py-16"
                data-ocid="owner.shop_empty_state"
              >
                <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have a shop yet.
                </p>
                <Dialog open={shopDialogOpen} onOpenChange={setShopDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full"
                      data-ocid="owner.create_shop_button"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create My Shop
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="bg-card border-border rounded-2xl max-h-[90vh] overflow-y-auto"
                    data-ocid="owner.create_shop_dialog"
                  >
                    <DialogHeader>
                      <DialogTitle>Create Your Shop</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                      {(
                        [
                          ["name", "Shop Name *", "text"],
                          ["description", "Description", "text"],
                          ["address", "Address *", "text"],
                          ["latitude", "Latitude", "number"],
                          ["longitude", "Longitude", "number"],
                          ["tiktok", "TikTok URL", "text"],
                          ["instagram", "Instagram URL", "text"],
                          ["facebook", "Facebook URL", "text"],
                          ["whatsapp", "WhatsApp Number", "text"],
                        ] as const
                      ).map(([key, label, type]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <Label>{label}</Label>
                          <Input
                            type={type}
                            data-ocid={`owner.shop_${key}_input`}
                            value={shopForm[key]}
                            onChange={(e) =>
                              setShopForm((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                            className="rounded-xl"
                          />
                        </div>
                      ))}
                      <Button
                        className="rounded-full"
                        onClick={handleCreateShop}
                        disabled={savingShop || !shopForm.name}
                        data-ocid="owner.create_shop_submit_button"
                      >
                        {savingShop ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {savingShop ? "Creating..." : "Create Shop"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
                data-ocid="owner.shop.card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{myShop.name}</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {myShop.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {myShop.address}
                    </p>
                  </div>
                  <Badge className="shrink-0">Active</Badge>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-2xl font-bold gold-text">
                      {shopProducts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold gold-text">
                      {shopOrders.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold gold-text">
                      $
                      {(
                        shopOrders.reduce(
                          (sum, o) =>
                            sum +
                            Number(o.totalPrice) -
                            Number(o.commissionAmount),
                          0,
                        ) / 100
                      ).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Earnings</p>
                  </div>
                </div>

                {/* Quick action to add product from shop tab */}
                <div className="flex gap-3 flex-wrap items-center">
                  <AddProductButton label="Add Product" />
                  <Button
                    variant="outline"
                    className="rounded-full gold-border gold-text"
                    onClick={() => setActiveTab("products")}
                    data-ocid="owner.shop.view_products_button"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View Products ({shopProducts.length})
                  </Button>
                </div>

                <div className="flex gap-3">
                  {myShop.tiktok && (
                    <a
                      href={myShop.tiktok}
                      target="_blank"
                      rel="noreferrer"
                      data-ocid="owner.shop.tiktok_link"
                    >
                      <SiTiktok className="w-5 h-5" />
                    </a>
                  )}
                  {myShop.facebook && (
                    <a
                      href={myShop.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500"
                      data-ocid="owner.shop.facebook_link"
                    >
                      <SiFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {myShop.instagram && (
                    <a
                      href={myShop.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-500"
                      data-ocid="owner.shop.instagram_link"
                    >
                      <SiInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {myShop.whatsapp && (
                    <a
                      href={`https://wa.me/${myShop.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-500"
                      data-ocid="owner.shop.whatsapp_link"
                    >
                      <SiWhatsapp className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Delete Shop */}
                <div className="pt-2 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        disabled={deletingShop}
                        data-ocid="owner.shop.delete_button"
                      >
                        {deletingShop ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete Shop
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="bg-card border-border rounded-2xl"
                      data-ocid="owner.shop.delete_dialog"
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Shop?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your shop and all its
                          products. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="rounded-full"
                          data-ocid="owner.shop.delete_cancel_button"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleDeleteShop}
                          data-ocid="owner.shop.delete_confirm_button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">My Products</h2>
              <AddProductButton label="Add Product" />
            </div>
            {shopProducts.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="owner.products_empty_state"
              >
                <Package className="w-10 h-10 mx-auto mb-3" />
                <p className="mb-4">No products yet.</p>
                <AddProductButton label="Add Your First Product" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {shopProducts.map((p, i) => (
                  <motion.div
                    key={p.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                    data-ocid={`owner.product.item.${i + 1}`}
                  >
                    <ProductImage product={p} />
                    <div className="p-3">
                      <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.category}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="gold-text font-bold text-sm">
                          ${(Number(p.price) / 100).toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Stock: {p.stock.toString()}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {shopOrders.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="owner.orders_empty_state"
              >
                <ShoppingBag className="w-10 h-10 mx-auto mb-3" />
                No orders yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {shopOrders.map((o, i) => {
                  const total = Number(o.totalPrice) / 100;
                  const commission = Number(o.commissionAmount) / 100;
                  return (
                    <motion.div
                      key={o.id.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card border border-border rounded-2xl p-4"
                      data-ocid={`owner.order.item.${i + 1}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold">
                          Order #{o.id.toString()}
                        </span>
                        <Badge>{o.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="gold-text font-bold">
                            ${total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fee (10%)</p>
                          <p>${commission.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">You get</p>
                          <p className="font-semibold">
                            ${(total - commission).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {o.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="rounded-full flex-1 text-xs"
                              onClick={() =>
                                handleUpdateOrderStatus(o.id, "confirmed")
                              }
                              data-ocid={`owner.order.confirm_button.${i + 1}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full flex-1 text-xs gold-border"
                              onClick={() =>
                                handleUpdateOrderStatus(o.id, "cancelled")
                              }
                              data-ocid={`owner.order.cancel_button.${i + 1}`}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {o.status === "confirmed" && (
                          <Button
                            size="sm"
                            className="rounded-full flex-1 text-xs"
                            onClick={() =>
                              handleUpdateOrderStatus(o.id, "completed")
                            }
                            data-ocid={`owner.order.complete_button.${i + 1}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            {notifications.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="owner.notifications_empty_state"
              >
                <Bell className="w-10 h-10 mx-auto mb-3" />
                No notifications yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id.toString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    data-ocid={`owner.notification.item.${i + 1}`}
                  >
                    <NotificationItem notif={n} onRead={handleMarkRead} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border flex items-stretch h-16"
        data-ocid="owner.tab"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setActiveTab(item.value)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "gold-text"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`owner.${item.value}.tab`}
              aria-label={item.label}
            >
              <span
                className={isActive ? "scale-110 transition-transform" : ""}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <footer className="text-center py-4 pb-20 text-muted-foreground text-xs border-t border-border">
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
