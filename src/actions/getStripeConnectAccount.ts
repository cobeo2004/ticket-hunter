"use server";

import { auth } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex";
import { api } from "../../convex/_generated/api";

export async function getStripeConnectAccount() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const stripeConnectId = await convex.query(
    api.users.getStripeConnectIdFromUser,
    {
      userId,
    }
  );

  return { stripeConnectId: stripeConnectId || null };
}
