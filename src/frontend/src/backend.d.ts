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
    instagram: string;
    name: string;
    whatsapp: string;
    description: string;
    facebook: string;
    longitude: number;
    address: string;
}
export interface Order {
    id: bigint;
    status: string;
    paymentStatus: string;
    shopId: bigint;
    productId: bigint;
    paymentProof?: ExternalBlob;
    quantity: bigint;
    commissionAmount: bigint;
    customerId: Principal;
    totalPrice: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, shopId: bigint): Promise<bigint>;
    createShop(name: string, description: string, address: string, latitude: number, longitude: number, tiktok: string, whatsapp: string, instagram: string, facebook: string): Promise<bigint>;
    deleteShop(shopId: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllShops(): Promise<Array<Shop>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyNotifications(): Promise<Array<Notification>>;
    getMyOrders(): Promise<Array<Order>>;
    getMyProfile(): Promise<UserProfile | null>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getShop(shopId: bigint): Promise<Shop | null>;
    getShopOrders(shopId: bigint): Promise<Array<Order>>;
    getShopProducts(shopId: bigint): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    placeOrder(productId: bigint, quantity: bigint): Promise<bigint>;
    registerProfile(name: string, email: string, preferredTheme: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updatePaymentProof(orderId: bigint, paymentProof: ExternalBlob): Promise<void>;
    updateProduct(productId: bigint, name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint): Promise<void>;
    updateShop(shopId: bigint, name: string, description: string, address: string, latitude: number, longitude: number, tiktok: string, whatsapp: string, instagram: string, facebook: string): Promise<void>;
}
