import "server-only";
import { ConvexClient } from "convex/browser";

export const getConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }

  return new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};

export const convex = getConvexClient();
