"use server";

import { auth } from "@clerk/nextjs/server";
import { Id } from "../../convex/_generated/dataModel";
import { convex } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import { stripe } from "@/lib/stripe";
import { DURATIONS } from "../../convex/constants";
import Stripe from "stripe";
import baseUrl from "@/lib/baseUrl";

export interface StripeCheckoutMetadata {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
}
export async function createStripeCheckoutSession({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const event = await convex.query(api.events.getEventById, { eventId });
  if (!event) throw new Error("Event not found");

  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("No valid ticket offer found");
  }

  const stripeConnectId = await convex.query(
    api.users.getStripeConnectIdFromUser,
    { userId }
  );

  if (!stripeConnectId) throw new Error("Stripe Connect ID not found");

  if (!queuePosition.offerExpiresAt)
    throw new Error("Offer has no expiration date");
  const metadata: StripeCheckoutMetadata = {
    eventId,
    userId,
    waitingListId: queuePosition._id,
  };

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: [
        "card",
        "afterpay_clearpay",
        "paypal",
        "samsung_pay",
      ],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: event.name,
              description: event.description,
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(event.price * 100 * 0.01),
      },
      expires_at: Math.floor(Date.now() / 1000) + DURATIONS.TICKET_OFFER / 1000,
      mode: "payment",
      success_url: `${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}event/${eventId}`,
      metadata: metadata as unknown as Stripe.MetadataParam,
    },
    { stripeAccount: stripeConnectId }
  );

  return { sessionId: session.id, sessionUrl: session.url };
}
