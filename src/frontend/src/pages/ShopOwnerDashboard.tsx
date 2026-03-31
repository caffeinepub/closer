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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Camera,
  Edit2,
  LogOut,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Notification, Order, Product, Shop } from "../backend";
import { BUSINESS_CATEGORIES } from "../constants/categories";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllShops,
  useCreateProduct,
  useCreateShop,
  useDeleteProduct,
  useDeleteShop,
  useMarkNotificationRead,
  useMyNotifications,
  useMyProfile,
  useShopOrders,
  useShopProducts,
  useToggleShopAvailability,
  useUpdateOrderStatus,
  useUpdateProduct,
  useUpdateShop,
  useUpdateShopLogo,
  useUpdateShopPaymentNumbers,
} from "../hooks/useQueries";
import {
  SOUND_OPTIONS,
  playNotificationSound,
  requestNotificationPermission,
  showBackgroundNotification,
} from "../utils/sound";

// ─── Shop Form ────────────────────────────────────────────────────────────────
type ShopWithAvailability = Shop & { isAvailable: boolean };

type ShopFormData = {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  paymentNumbers: string;
  category: string;
};

const emptyShopForm = (): ShopFormData => ({
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  paymentNumbers: "",
  category: "",
});

function ShopForm({
  initial,
  onSubmit,
  isPending,
  onCancel,
}: {
  initial?: ShopFormData;
  onSubmit: (d: ShopFormData) => void;
  isPending: boolean;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<ShopFormData>(initial || emptyShopForm());
  const set =
    (k: keyof ShopFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-3">
      <div>
        <Label>Jina la Duka *</Label>
        <Input
          value={form.name}
          onChange={set("name")}
          placeholder="Duka la Amina"
          className="mt-1"
          data-ocid="shop_form.name.input"
        />
      </div>
      <div>
        <Label>Maelezo</Label>
        <Textarea
          value={form.description}
          onChange={set("description")}
          placeholder="Tunauza..."
          className="mt-1"
          data-ocid="shop_form.description.textarea"
          rows={2}
        />
      </div>
      <div>
        <Label>Anwani *</Label>
        <Input
          value={form.address}
          onChange={set("address")}
          placeholder="Mtaa, Mji"
          className="mt-1"
          data-ocid="shop_form.address.input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Latitudo</Label>
          <Input
            value={form.latitude}
            onChange={set("latitude")}
            placeholder="-1.286"
            type="number"
            className="mt-1"
            data-ocid="shop_form.latitude.input"
          />
        </div>
        <div>
          <Label>Longitudo</Label>
          <Input
            value={form.longitude}
            onChange={set("longitude")}
            placeholder="36.817"
            type="number"
            className="mt-1"
            data-ocid="shop_form.longitude.input"
          />
        </div>
      </div>
      <div>
        <Label>WhatsApp</Label>
        <Input
          value={form.whatsapp}
          onChange={set("whatsapp")}
          placeholder="+254700000000"
          className="mt-1"
          data-ocid="shop_form.whatsapp.input"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Instagram</Label>
          <Input
            value={form.instagram}
            onChange={set("instagram")}
            placeholder="@duka"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Facebook</Label>
          <Input
            value={form.facebook}
            onChange={set("facebook")}
            placeholder="DukaAmina"
            className="mt-1"
          />
        </div>
        <div>
          <Label>TikTok</Label>
          <Input
            value={form.tiktok}
            onChange={set("tiktok")}
            placeholder="@duka"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Aina ya Biashara / Business Category *</Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
        >
          <SelectTrigger className="mt-1" data-ocid="shop_form.category.select">
            <SelectValue placeholder="Chagua aina ya biashara..." />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Namba za Malipo / Payment Numbers</Label>
        <Input
          value={form.paymentNumbers}
          onChange={set("paymentNumbers")}
          placeholder="M-Pesa: 0712345678, CRDB: 123456..."
          className="mt-1"
          data-ocid="shop_form.payment_numbers.input"
        />
      </div>
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            data-ocid="shop_form.cancel_button"
          >
            Ghairi
          </Button>
        )}
        <Button
          onClick={() => onSubmit(form)}
          disabled={isPending}
          className="flex-1 font-semibold"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
          data-ocid="shop_form.submit.primary_button"
        >
          {isPending ? "Inahifadhi..." : "Hifadhi Duka"}
        </Button>
      </div>
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageFile: File | null;
};

const emptyProductForm = (): ProductFormData => ({
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  imageFile: null,
});

function ProductForm({
  initial,
  onSubmit,
  isPending,
  onCancel,
}: {
  initial?: Partial<ProductFormData> & { imageUrl?: string };
  onSubmit: (d: ProductFormData) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>({
    ...emptyProductForm(),
    ...initial,
  });
  const [preview, setPreview] = useState<string | null>(
    initial?.imageUrl || null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const set =
    (k: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-3">
      {/* Image */}
      <div>
        <Label>Picha ya Bidhaa</Label>
        <button
          type="button"
          className="mt-1 aspect-square w-32 rounded-xl overflow-hidden cursor-pointer border-2 border-dashed flex items-center justify-center"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--muted))",
          }}
          onClick={() => fileRef.current?.click()}
          data-ocid="product_form.image.dropzone"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Plus size={24} style={{ color: "hsl(var(--muted-foreground))" }} />
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setForm((prev) => ({ ...prev, imageFile: f }));
              setPreview(URL.createObjectURL(f));
            }
          }}
        />
      </div>
      <div>
        <Label>Jina la Bidhaa *</Label>
        <Input
          value={form.name}
          onChange={set("name")}
          placeholder="Mkoba wa Ngozi"
          className="mt-1"
          data-ocid="product_form.name.input"
        />
      </div>
      <div>
        <Label>Maelezo</Label>
        <Textarea
          value={form.description}
          onChange={set("description")}
          placeholder="Bidhaa hii ni..."
          className="mt-1"
          rows={2}
          data-ocid="product_form.description.textarea"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Bei (TZS) *</Label>
          <Input
            value={form.price}
            onChange={set("price")}
            placeholder="1500"
            type="number"
            className="mt-1"
            data-ocid="product_form.price.input"
          />
        </div>
        <div>
          <Label>Hisa *</Label>
          <Input
            value={form.stock}
            onChange={set("stock")}
            placeholder="10"
            type="number"
            className="mt-1"
            data-ocid="product_form.stock.input"
          />
        </div>
      </div>
      <div>
        <Label>Kategoria</Label>
        <Input
          value={form.category}
          onChange={set("category")}
          placeholder="Mavazi, Chakula..."
          className="mt-1"
          data-ocid="product_form.category.input"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          data-ocid="product_form.cancel_button"
        >
          Ghairi
        </Button>
        <Button
          onClick={() => onSubmit(form)}
          disabled={isPending}
          className="flex-1 font-semibold"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
          data-ocid="product_form.submit.primary_button"
        >
          {isPending ? "Inahifadhi..." : "Hifadhi Bidhaa"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function ShopOwnerDashboard() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useMyProfile();
  const { data: allShops, isLoading: shopsLoading } = useAllShops();
  const myShop =
    allShops?.find(
      (s) => s.owner.toString() === identity?.getPrincipal().toString(),
    ) || null;

  const { data: products } = useShopProducts(myShop?.id || null);
  const { data: orders } = useShopOrders(myShop?.id || null);
  const { data: notifications } = useMyNotifications();

  const createShop = useCreateShop();
  const updateShop = useUpdateShop();
  const deleteShop = useDeleteShop();
  const deleteProduct = useDeleteProduct();
  const [profileImageOpen, setProfileImageOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<bigint | null>(null);
  const updateShopLogo = useUpdateShopLogo();
  const updateShopPaymentNumbers = useUpdateShopPaymentNumbers();
  const toggleAvailability = useToggleShopAvailability();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !myShop) return;
    updateShopLogo.mutate(
      { shopId: myShop.id, file: f },
      {
        onSuccess: () => toast.success("Nembo imehifadhiwa!"),
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const markRead = useMarkNotificationRead();

  const [showShopForm, setShowShopForm] = useState(false);
  const [editingShop, setEditingShop] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifSound, setNotifSoundState] = useState(
    () => localStorage.getItem("notif_sound") || "beep",
  );
  const setNotifSound = (val: string) => {
    setNotifSoundState(val);
    localStorage.setItem("notif_sound", val);
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const prevUnread = useRef(unreadCount);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      showBackgroundNotification(
        "Agizo Jipya! / New Order!",
        "Una agizo jipya kwenye duka lako.",
        notifSound,
      );
    }
    prevUnread.current = unreadCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadCount, notifSound]);

  const handleCreateShop = (form: ShopFormData) => {
    createShop.mutate(
      {
        name: form.name,
        description: form.description,
        address: form.address,
        latitude: Number.parseFloat(form.latitude) || 0,
        longitude: Number.parseFloat(form.longitude) || 0,
        tiktok: form.tiktok,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        facebook: form.facebook,
        category: form.category,
      },
      {
        onSuccess: (shopId) => {
          if (form.paymentNumbers) {
            updateShopPaymentNumbers.mutate({
              shopId,
              paymentNumbers: form.paymentNumbers,
            });
          }
          toast.success("Duka limeundwa!");
          setShowShopForm(false);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const handleUpdateShop = (form: ShopFormData) => {
    if (!myShop) return;
    updateShop.mutate(
      {
        shopId: myShop.id,
        name: form.name,
        description: form.description,
        address: form.address,
        latitude: Number.parseFloat(form.latitude) || 0,
        longitude: Number.parseFloat(form.longitude) || 0,
        tiktok: form.tiktok,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        facebook: form.facebook,
        category: form.category,
      },
      {
        onSuccess: () => {
          if (myShop) {
            updateShopPaymentNumbers.mutate({
              shopId: myShop.id,
              paymentNumbers: form.paymentNumbers,
            });
          }
          toast.success("Duka limesasishwa!");
          setEditingShop(false);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const handleDeleteShop = () => {
    if (!myShop) return;
    deleteShop.mutate(myShop.id, {
      onSuccess: () => toast.success("Duka limefutwa"),
      onError: () => toast.error("Hitilafu — jaribu tena"),
    });
  };

  const handleCreateProduct = (form: ProductFormData) => {
    if (!myShop) return;
    createProduct.mutate(
      {
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(Number.parseFloat(form.price) || 0)),
        category: form.category,
        imageFile: form.imageFile,
        stock: BigInt(Number.parseInt(form.stock) || 0),
        shopId: myShop.id,
      },
      {
        onSuccess: () => {
          toast.success("Bidhaa imeongezwa!");
          setShowProductForm(false);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const handleUpdateProduct = (form: ProductFormData) => {
    if (!editingProduct || !myShop) return;
    updateProduct.mutate(
      {
        productId: editingProduct.id,
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(Number.parseFloat(form.price) || 0)),
        category: form.category,
        imageFile: form.imageFile,
        existingImage: editingProduct.image,
        stock: BigInt(Number.parseInt(form.stock) || 0),
        shopId: myShop.id,
      },
      {
        onSuccess: () => {
          toast.success("Bidhaa imesasishwa!");
          setEditingProduct(null);
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  if (shopsLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton
          className="h-32 rounded-xl"
          data-ocid="office.loading_state"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 sticky top-0 z-10 flex items-center justify-between"
        style={{
          background: "hsl(var(--background))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-center gap-2">
          {profile?.profilePicture?.getDirectURL?.() ? (
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={profile.profilePicture.getDirectURL()}
                alt={profile.name}
                loading="eager"
              />
              <AvatarFallback
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <h1
            className="text-xl font-bold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Ofisi Yangu
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-xl"
            style={{ background: "hsl(var(--card))" }}
            data-ocid="office.notifications.open_modal_button"
          >
            <Bell size={20} style={{ color: "hsl(var(--foreground))" }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "hsl(0,70%,50%)", color: "white" }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => clear()}
            title="Toka / Logout"
            className="p-2 rounded-xl flex flex-col items-center gap-0.5"
            style={{ background: "hsl(var(--card))" }}
            data-ocid="office.logout.button"
          >
            <LogOut size={20} style={{ color: "hsl(0,70%,55%)" }} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {!myShop ? (
          /* No shop yet */
          <div className="px-4 py-6">
            {!showShopForm ? (
              <div
                className="rounded-2xl p-6 text-center border"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
                data-ocid="office.no_shop.panel"
              >
                <Store
                  size={40}
                  className="mx-auto mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <h2
                  className="font-bold text-lg mb-1"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Unda Duka Lako
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Anza kuuza bidhaa zako mtandaoni leo hii
                </p>
                <Button
                  onClick={() => setShowShopForm(true)}
                  data-ocid="office.create_shop.primary_button"
                  className="font-semibold"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  <Plus size={16} className="mr-1" /> Unda Duka
                </Button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-4 border"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <h2
                  className="font-bold mb-4"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Duka Jipya
                </h2>
                <ShopForm
                  onSubmit={handleCreateShop}
                  isPending={createShop.isPending}
                  onCancel={() => setShowShopForm(false)}
                />
              </div>
            )}
          </div>
        ) : (
          /* Has shop */
          <div className="px-4 py-4">
            {/* Shop card */}
            {editingShop ? (
              <div
                className="rounded-2xl p-4 border mb-4"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <h2
                  className="font-bold mb-4"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Hariri Duka
                </h2>
                <ShopForm
                  initial={{
                    name: myShop.name,
                    description: myShop.description,
                    address: myShop.address,
                    latitude: myShop.latitude.toString(),
                    longitude: myShop.longitude.toString(),
                    whatsapp: myShop.whatsapp,
                    instagram: myShop.instagram,
                    facebook: myShop.facebook,
                    tiktok: myShop.tiktok,
                    paymentNumbers: myShop.paymentNumbers || "",
                    category: (myShop as any).category || "",
                  }}
                  onSubmit={handleUpdateShop}
                  isPending={updateShop.isPending}
                  onCancel={() => setEditingShop(false)}
                />
              </div>
            ) : (
              <div
                className="rounded-2xl p-4 border mb-4"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
                data-ocid="office.shop.card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Shop logo */}
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage
                            src={myShop.logo?.getDirectURL?.() || undefined}
                            alt={myShop.name}
                          />
                          <AvatarFallback
                            style={{
                              background: "hsl(var(--primary))",
                              color: "hsl(var(--primary-foreground))",
                              fontSize: "1rem",
                              fontWeight: 700,
                            }}
                          >
                            {myShop.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          data-ocid="office.shop_logo.upload_button"
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow border-2"
                          style={{
                            background: "hsl(var(--primary))",
                            borderColor: "hsl(var(--card))",
                            color: "hsl(var(--primary-foreground))",
                          }}
                        >
                          <Camera size={11} />
                        </button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </div>
                      <div>
                        <h2
                          className="font-bold"
                          style={{ color: "hsl(var(--card-foreground))" }}
                        >
                          {myShop.name}
                        </h2>
                        <p
                          className="text-xs"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Picha ya Duka / Shop Logo
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1 mt-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      <MapPin size={12} />
                      <span className="text-xs">{myShop.address}</span>
                    </div>
                    {myShop.description && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {myShop.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingShop(true)}
                      className="p-2 rounded-lg"
                      style={{ background: "hsl(var(--secondary))" }}
                      data-ocid="office.shop.edit_button"
                    >
                      <Edit2
                        size={14}
                        style={{ color: "hsl(var(--foreground))" }}
                      />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="p-2 rounded-lg"
                          style={{ background: "hsl(0,70%,20%)" }}
                          data-ocid="office.shop.delete_button"
                        >
                          <Trash2
                            size={14}
                            style={{ color: "hsl(0,70%,60%)" }}
                          />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        data-ocid="office.delete_shop.dialog"
                        style={{
                          background: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            Futa Duka?
                          </AlertDialogTitle>
                          <AlertDialogDescription
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Hatua hii haiwezi kurudishwa. Duka na bidhaa zake
                            zote zitafutwa.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="office.delete_shop.cancel_button">
                            Ghairi
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteShop}
                            data-ocid="office.delete_shop.confirm_button"
                            style={{
                              background: "hsl(0,70%,50%)",
                              color: "white",
                            }}
                          >
                            Futa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 transition-colors"
                        style={{
                          background:
                            (myShop as ShopWithAvailability).isAvailable !==
                            false
                              ? "hsl(142,70%,45%)"
                              : "hsl(var(--muted-foreground))",
                          boxShadow:
                            (myShop as ShopWithAvailability).isAvailable !==
                            false
                              ? "0 0 6px hsl(142,70%,45%)"
                              : "none",
                        }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            (myShop as ShopWithAvailability).isAvailable !==
                            false
                              ? "hsl(142,70%,38%)"
                              : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {(myShop as ShopWithAvailability).isAvailable !== false
                          ? "Wazi / Open"
                          : "Imefungwa / Closed"}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {(myShop as ShopWithAvailability).isAvailable !== false
                        ? "Duka linaonekana kwa wateja"
                        : "Duka halionekani kwa wateja"}
                    </span>
                  </div>
                  <Switch
                    checked={
                      (myShop as ShopWithAvailability).isAvailable !== false
                    }
                    onCheckedChange={() => toggleAvailability.mutate(myShop.id)}
                    disabled={toggleAvailability.isPending}
                    data-ocid="office.shop.toggle"
                    style={{ "--switch-thumb": "white" } as React.CSSProperties}
                  />
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="products">
              <TabsList className="w-full" data-ocid="office.tabs.tab">
                <TabsTrigger
                  value="products"
                  className="flex-1"
                  data-ocid="office.products.tab"
                >
                  <Package size={14} className="mr-1" /> Bidhaa
                  {products && (
                    <Badge className="ml-1 text-xs">{products.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="flex-1"
                  data-ocid="office.orders.tab"
                >
                  <ShoppingCart size={14} className="mr-1" /> Maagizo
                  {orders && (
                    <Badge className="ml-1 text-xs">{orders.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex-1"
                  data-ocid="office.settings.tab"
                >
                  ⚙️ Mipangilio
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="mt-4">
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="w-full mb-4 font-semibold"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                  data-ocid="office.add_product.primary_button"
                >
                  <Plus size={16} className="mr-1" /> + Ongeza Bidhaa
                </Button>

                {products && products.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-ocid="office.products.empty_state"
                  >
                    <Package
                      size={32}
                      className="mx-auto mb-2"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Bado hujaorodhesha bidhaa
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {(products || []).map((p, i) => (
                      <div
                        key={p.id.toString()}
                        className="rounded-xl overflow-hidden border"
                        style={{
                          background: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }}
                        data-ocid={`office.product.item.${i + 1}`}
                      >
                        <div
                          className="aspect-square overflow-hidden"
                          style={{ background: "hsl(var(--muted))" }}
                        >
                          {p.image.getDirectURL() ? (
                            <img
                              src={p.image.getDirectURL()}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              onLoad={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.opacity = "1";
                              }}
                              style={{
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package
                                size={20}
                                style={{
                                  color: "hsl(var(--muted-foreground))",
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p
                            className="font-medium text-xs truncate"
                            style={{ color: "hsl(var(--card-foreground))" }}
                          >
                            {p.name}
                          </p>
                          <p
                            className="text-xs font-bold mt-0.5"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            TZS {Number(p.price).toLocaleString()}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Hisa: {Number(p.stock)}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setShowProductForm(true);
                              }}
                              className="flex-1 py-1 rounded text-xs"
                              style={{
                                background: "hsl(var(--secondary))",
                                color: "hsl(var(--secondary-foreground))",
                              }}
                              data-ocid={`office.product.edit_button.${i + 1}`}
                            >
                              <Edit2 size={10} className="inline mr-0.5" />{" "}
                              Hariri
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteProductId(p.id)}
                              className="py-1 px-2 rounded text-xs"
                              style={{
                                background: "hsl(0,72%,51% / 0.12)",
                                color: "hsl(0,72%,51%)",
                                border: "1px solid hsl(0,72%,51% / 0.3)",
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-4 space-y-3">
                {!orders || orders.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-ocid="office.orders.empty_state"
                  >
                    <ShoppingCart
                      size={32}
                      className="mx-auto mb-2"
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
                  orders.map((order, i) => (
                    <OrderRow
                      key={order.id.toString()}
                      order={order}
                      idx={i}
                      productName={
                        (products || []).find((p) => p.id === order.productId)
                          ?.name || `Bidhaa #${order.productId.toString()}`
                      }
                      onStatusChange={(status) =>
                        updateOrderStatus.mutate(
                          { orderId: order.id, status, shopId: myShop.id },
                          {
                            onSuccess: () => toast.success("Hali imesasishwa!"),
                            onError: () => toast.error("Hitilafu"),
                          },
                        )
                      }
                    />
                  ))
                )}
              </TabsContent>
              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-4">
                <div
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      marginBottom: 16,
                      fontSize: 16,
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    ⚙️ Mipangilio / Settings
                  </h3>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      🔔 Sauti ya Arifa / Notification Sound
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {SOUND_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px",
                            borderRadius: 8,
                            border:
                              notifSound === opt.id
                                ? "2px solid hsl(var(--primary))"
                                : "1px solid hsl(var(--border))",
                            background:
                              notifSound === opt.id
                                ? "hsl(var(--primary) / 0.08)"
                                : "hsl(var(--background))",
                            cursor: "pointer",
                            fontWeight: notifSound === opt.id ? 600 : 400,
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          <input
                            type="radio"
                            name="notif_sound"
                            value={opt.id}
                            checked={notifSound === opt.id}
                            onChange={() => setNotifSound(opt.id)}
                            data-ocid="settings.notif_sound.radio"
                            style={{ accentColor: "hsl(var(--primary))" }}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => playNotificationSound(notifSound)}
                      data-ocid="settings.preview.button"
                      style={{
                        marginTop: 14,
                        padding: "10px 20px",
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      ▶ Jaribu / Preview
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Profile Image Fullscreen Modal */}
      {profileImageOpen && profile?.profilePicture?.getDirectURL?.() && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center w-full"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "none",
            cursor: "default",
          }}
          onClick={() => setProfileImageOpen(false)}
        >
          <img
            src={profile.profilePicture.getDirectURL()}
            alt={profile.name}
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              borderRadius: 16,
              boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setProfileImageOpen(false)}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              cursor: "pointer",
              color: "#fff",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </button>
      )}

      {/* Delete Product Confirmation Dialog */}
      <AlertDialog
        open={deleteProductId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteProductId(null);
        }}
      >
        <AlertDialogContent
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "hsl(var(--foreground))" }}>
              Futa Bidhaa?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Hatua hii haiwezi kurudishwa. Bidhaa itafutwa kabisa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ghairi</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteProductId !== null) {
                  deleteProduct.mutate(deleteProductId, {
                    onSuccess: () => {
                      toast.success("Bidhaa imefutwa!");
                      setDeleteProductId(null);
                    },
                    onError: () => toast.error("Hitilafu ya kufuta"),
                  });
                }
              }}
              style={{ background: "hsl(0,72%,51%)", color: "#fff" }}
            >
              Futa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product form dialog */}
      <Dialog
        open={showProductForm}
        onOpenChange={(o) => {
          if (!o) {
            setShowProductForm(false);
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="product_form.dialog"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
              {editingProduct ? "Hariri Bidhaa" : "Bidhaa Mpya"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initial={
              editingProduct
                ? {
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: Number(editingProduct.price).toString(),
                    category: editingProduct.category,
                    stock: Number(editingProduct.stock).toString(),
                    imageUrl: editingProduct.image.getDirectURL(),
                  }
                : undefined
            }
            onSubmit={
              editingProduct ? handleUpdateProduct : handleCreateProduct
            }
            isPending={
              editingProduct ? updateProduct.isPending : createProduct.isPending
            }
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Notifications dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent
          data-ocid="notifications.dialog"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
              Arifa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <p
                className="text-sm text-center py-4"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-ocid="notifications.empty_state"
              >
                Hakuna arifa
              </p>
            ) : (
              notifications.map((n, i) => (
                <NotificationItem
                  key={n.id.toString()}
                  notification={n}
                  idx={i}
                  onRead={() => markRead.mutate(n.id)}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderRow({
  order,
  idx,
  productName,
  onStatusChange,
}: {
  order: Order;
  idx: number;
  productName: string;
  onStatusChange: (s: string) => void;
}) {
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "delivered",
    "cancelled",
  ];
  const labelMap: Record<string, string> = {
    pending: "Inasubiri",
    confirmed: "Imethibitishwa",
    processing: "Inatengenezwa",
    delivered: "Imetolewa",
    cancelled: "Imeghairiwa",
  };
  return (
    <div
      className="rounded-xl p-3 border space-y-2"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
      data-ocid={`office.order.item.${idx + 1}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: "hsl(var(--primary))" }}
          >
            {productName}
          </p>
          <p
            className="text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Agizo #{order.id.toString()}
          </p>
          <p
            className="text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Idadi: {Number(order.quantity)} • TZS{" "}
            {Number(order.totalPrice).toLocaleString()}
          </p>
          {order.customerName && (
            <p
              className="text-xs font-medium"
              style={{ color: "hsl(200,70%,60%)" }}
            >
              ud83dudcde Wasiliana: {order.customerName}
              {order.customerPhone ? ` u2022 ${order.customerPhone}` : ""}
            </p>
          )}
        </div>
        <Select value={order.status} onValueChange={onStatusChange}>
          <SelectTrigger
            className="w-36 text-xs"
            data-ocid={`office.order.status.select.${idx + 1}`}
          >
            <SelectValue placeholder={labelMap[order.status] || order.status} />
          </SelectTrigger>
          <SelectContent style={{ background: "hsl(var(--card))" }}>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {labelMap[s] || s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {order.paymentProof && (
        <p className="text-xs" style={{ color: "hsl(120,50%,45%)" }}>
          ✓ Uthibitisho wa malipo umepokewa
        </p>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  idx,
  onRead,
}: { notification: Notification; idx: number; onRead: () => void }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{
        background: notification.isRead
          ? "hsl(var(--muted))"
          : "hsl(var(--accent) / 0.1)",
        borderLeft: notification.isRead
          ? "none"
          : "3px solid hsl(var(--primary))",
      }}
      data-ocid={`notifications.item.${idx + 1}`}
    >
      <div className="flex-1">
        <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
          {notification.message}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {new Date(
            Number(notification.timestamp) / 1_000_000,
          ).toLocaleString()}
        </p>
      </div>
      {!notification.isRead && (
        <button
          type="button"
          onClick={onRead}
          className="text-xs px-2 py-1 rounded"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
          data-ocid={`notifications.mark_read.button.${idx + 1}`}
        >
          Soma
        </button>
      )}
    </div>
  );
}
