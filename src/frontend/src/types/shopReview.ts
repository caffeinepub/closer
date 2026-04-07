import type { Principal } from "@icp-sdk/core/principal";

export interface ShopReview {
  id: bigint;
  shopId: bigint;
  userId: Principal;
  userName: string;
  rating: bigint;
  comment: string;
  timestamp: bigint;
}
