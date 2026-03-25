import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppSettings,
  Notification,
  Order,
  PaymentReference,
  Product,
  Shop,
  UserProfile,
} from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useAllShops() {
  const { actor, isFetching } = useActor();
  return useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveShops() {
  const { actor, isFetching } = useActor();
  return useQuery<Shop[]>({
    queryKey: ["activeShops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveShops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useShopProducts(shopId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["shopProducts", shopId?.toString()],
    queryFn: async () => {
      if (!actor || shopId === null) return [];
      return actor.getShopProducts(shopId);
    },
    enabled: !!actor && !isFetching && shopId !== null,
  });
}

export function useShopOrders(shopId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["shopOrders", shopId?.toString()],
    queryFn: async () => {
      if (!actor || shopId === null) return [];
      return actor.getShopOrders(shopId);
    },
    enabled: !!actor && !isFetching && shopId !== null,
  });
}

export function useMyNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMyProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    // Retry so that after registration the admin status is refreshed
    retry: 3,
    retryDelay: 1000,
  });
}

export function useAppSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<AppSettings | null>({
    queryKey: ["appSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAppSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingReferences() {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentReference[]>({
    queryKey: ["pendingReferences"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingReferences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyReferences(shopId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentReference[]>({
    queryKey: ["myReferences", shopId?.toString()],
    queryFn: async () => {
      if (!actor || shopId === null) return [];
      return actor.getMyReferences(shopId);
    },
    enabled: !!actor && !isFetching && shopId !== null,
  });
}

export function useAllOrdersAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrdersAdmin"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getAllOrdersAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useShopsByCategory(category: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Shop[]>({
    queryKey: ["shopsByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getShopsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useActiveShopsByCategory(category: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Shop[]>({
    queryKey: ["activeShopsByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getActiveShopsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(productId, quantity);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

export function useCreateShop() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      address: string;
      latitude: number;
      longitude: number;
      tiktok: string;
      whatsapp: string;
      instagram: string;
      facebook: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).createShop(
        data.name,
        data.description,
        data.address,
        data.latitude,
        data.longitude,
        data.tiktok,
        data.whatsapp,
        data.instagram,
        data.facebook,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useUpdateShop() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      shopId: bigint;
      name: string;
      description: string;
      address: string;
      latitude: number;
      longitude: number;
      tiktok: string;
      whatsapp: string;
      instagram: string;
      facebook: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateShop(
        data.shopId,
        data.name,
        data.description,
        data.address,
        data.latitude,
        data.longitude,
        data.tiktok,
        data.whatsapp,
        data.instagram,
        data.facebook,
        data.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useUpdateShopPaymentNumbers() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shopId,
      paymentNumbers,
    }: { shopId: bigint; paymentNumbers: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateShopPaymentNumbers(shopId, paymentNumbers);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useDeleteShop() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shopId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteShop(shopId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useUpdateShopLogo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ shopId, file }: { shopId: bigint; file: File }) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.updateShopLogo(shopId, blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useUpdateProfilePicture() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.updateProfilePicture(blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProfile"] }),
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      stock: bigint;
      shopId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      let imageBlob: ExternalBlob;
      if (data.imageFile) {
        const bytes = new Uint8Array(await data.imageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(bytes);
      } else {
        imageBlob = ExternalBlob.fromBytes(new Uint8Array(0));
      }
      return actor.createProduct(
        data.name,
        data.description,
        data.price,
        data.category,
        imageBlob,
        data.stock,
        data.shopId,
      );
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["shopProducts", vars.shopId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      existingImage: ExternalBlob;
      stock: bigint;
      shopId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      let imageBlob: ExternalBlob;
      if (data.imageFile) {
        const bytes = new Uint8Array(await data.imageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(bytes);
      } else {
        imageBlob = data.existingImage;
      }
      return actor.updateProduct(
        data.productId,
        data.name,
        data.description,
        data.price,
        data.category,
        imageBlob,
        data.stock,
      );
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["shopProducts", vars.shopId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: string; shopId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["shopOrders", vars.shopId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

export function useUpdatePaymentProof() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      file,
      paymentNote,
    }: { orderId: bigint; file: File; paymentNote?: string }) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.uploadPaymentProof(orderId, blob, paymentNote || "");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myOrders"] }),
  });
}

export function useUpdatePaymentNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      paymentNote,
    }: { orderId: bigint; paymentNote: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePaymentNote(orderId, paymentNote);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myOrders"] }),
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useRegisterProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      theme,
    }: { name: string; phone: string; email: string; theme: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProfile(name, phone, email, theme);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProfile"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shopProducts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSubmitSubscriptionReference() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shopId,
      referenceNumber,
    }: { shopId: bigint; referenceNumber: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitSubscriptionReference(shopId, referenceNumber);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myReferences"] });
      qc.invalidateQueries({ queryKey: ["pendingReferences"] });
    },
  });
}

export function useUpdateAppSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (platformPaymentNumber: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAppSettings(platformPaymentNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appSettings"] }),
  });
}

export function useApproveSubscriptionReference() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (referenceId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveSubscriptionReference(referenceId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingReferences"] });
      qc.invalidateQueries({ queryKey: ["shops"] });
      qc.invalidateQueries({ queryKey: ["activeShops"] });
    },
  });
}

export function useRejectSubscriptionReference() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (referenceId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectSubscriptionReference(referenceId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingReferences"] }),
  });
}

export function useToggleShopAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shopId: bigint) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).toggleShopAvailability(shopId) as Promise<boolean>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shops"] });
      qc.invalidateQueries({ queryKey: ["activeShops"] });
    },
  });
}
