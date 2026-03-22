import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    paymentStatus: string;
    shopId: bigint;
    customerPhone: string;
    productId: bigint;
    paymentProof?: ExternalBlob;
    quantity: bigint;
    paymentNote: string;
    commissionAmount: bigint;
    customerId: Principal;
    totalPrice: bigint;
}
export interface AppSettings {
    platformPaymentNumber: string;
}
export interface Notification {
    id: bigint;
    ownerId: Principal;
    isRead: boolean;
    orderId: bigint;
    message: string;
    timestamp: bigint;
}
export interface Shop {
    id: bigint;
    latitude: number;
    tiktok: string;
    owner: Principal;
    subscriptionExpiry: bigint;
    instagram: string;
    logo?: ExternalBlob;
    name: string;
    whatsapp: string;
    description: string;
    isActive: boolean;
    paymentNumbers: string;
    facebook: string;
    longitude: number;
    address: string;
}
export interface PaymentReference {
    id: bigint;
    status: string;
    referenceNumber: string;
    ownerName: string;
    shopId: bigint;
    ownerId: Principal;
    submittedAt: bigint;
    shopName: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    profilePicture?: ExternalBlob;
    preferredTheme: string;
}
export interface Product {
    id: bigint;
    shopId: bigint;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    image: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveSubscriptionReference(referenceId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, shopId: bigint): Promise<bigint>;
    createShop(name: string, description: string, address: string, latitude: number, longitude: number, tiktok: string, whatsapp: string, instagram: string, facebook: string): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    deleteShop(shopId: bigint): Promise<void>;
    getActiveShops(): Promise<Array<Shop>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllReferences(): Promise<Array<PaymentReference>>;
    getAllShops(): Promise<Array<Shop>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getAppSettings(): Promise<AppSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyNotifications(): Promise<Array<Notification>>;
    getMyOrders(): Promise<Array<Order>>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyReferences(shopId: bigint): Promise<Array<PaymentReference>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getPendingReferences(): Promise<Array<PaymentReference>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getShop(shopId: bigint): Promise<Shop | null>;
    getShopOrders(shopId: bigint): Promise<Array<Order>>;
    getShopProducts(shopId: bigint): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    placeOrder(productId: bigint, quantity: bigint): Promise<bigint>;
    registerProfile(name: string, phone: string, email: string, preferredTheme: string): Promise<void>;
    rejectSubscriptionReference(referenceId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitSubscriptionReference(shopId: bigint, referenceNumber: string): Promise<bigint>;
    updateAppSettings(platformPaymentNumber: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updatePaymentNote(orderId: bigint, paymentNote: string): Promise<void>;
    updateProduct(productId: bigint, name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint): Promise<void>;
    updateProfilePicture(callerProfilePicture: ExternalBlob): Promise<void>;
    updateShop(shopId: bigint, name: string, description: string, address: string, latitude: number, longitude: number, tiktok: string, whatsapp: string, instagram: string, facebook: string): Promise<void>;
    updateShopLogo(shopId: bigint, shopLogo: ExternalBlob): Promise<void>;
    updateShopPaymentNumbers(shopId: bigint, paymentNumbers: string): Promise<void>;
    uploadPaymentProof(orderId: bigint, paymentProof: ExternalBlob, paymentNote: string): Promise<void>;
}
