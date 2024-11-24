"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createStripeConnectAccountLink(account: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") ?? "";

    const aacountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: `${origin}/connect/refresh/${account}`,
      return_url: `${origin}/connect/return/${account}`,
      type: "account_onboarding",
    });

    return { url: aacountLink.url };
  } catch (error) {
    console.error("Error creating Stripe Connect account link", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "Unexpected error while creating Stripe Connect account link"
    );
  }
}
