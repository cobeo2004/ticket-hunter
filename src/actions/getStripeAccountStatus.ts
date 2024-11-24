"use server";

import { stripe } from "@/lib/stripe";

export interface StripeAccountStatus {
  isActive: boolean;
  requiresInformation: boolean;
  requirements: {
    currently_due: Array<string>;
    eventually_due: Array<string>;
    past_due: Array<string>;
  };
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export async function getStripeAccountStatus(
  stripeConnectId: string
): Promise<StripeAccountStatus> {
  if (!stripeConnectId) throw new Error("Stripe Connect ID is required");
  try {
    const account = await stripe.accounts.retrieve(stripeConnectId);
    return {
      isActive:
        account.details_submitted &&
        !account.requirements?.currently_due?.length,
      requiresInformation: !!(
        account.requirements?.currently_due?.length ||
        account.requirements?.eventually_due?.length ||
        account.requirements?.past_due?.length
      ),
      requirements: {
        currently_due: account.requirements?.currently_due ?? [],
        eventually_due: account.requirements?.eventually_due ?? [],
        past_due: account.requirements?.past_due ?? [],
      },
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  } catch (error) {
    console.error("Error getting Stripe account status", error);
    throw new Error("Failed to get Stripe account status");
  }
}
