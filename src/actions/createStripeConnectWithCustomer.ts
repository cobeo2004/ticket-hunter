"use server";

import { auth } from "@clerk/nextjs/server";

import { api } from "../../convex/_generated/api";
import { stripe } from "@/lib/stripe";
import { convex } from "@/lib/convex";

export async function createStripeConnectWithCustomer() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingStripeId = await convex.query(
    api.users.getStripeConnectIdFromUser,
    {
      userId,
    }
  );

  if (existingStripeId) {
    return { account: existingStripeId };
  }

  const stripeAccount = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
      afterpay_clearpay_payments: {
        requested: true,
      },
    },
  });

  await convex.mutation(api.users.linkStripeConnectIdToUser, {
    userId,
    stripeConnectId: stripeAccount.id,
  });

  return { account: stripeAccount.id };
}
