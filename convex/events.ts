import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { internal } from "./_generated/api";

export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("is_cancelled"), undefined))
      .collect();
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

export const getEventAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const purchasedCounts = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (t) =>
              t.status === TICKET_STATUS.VALID ||
              t.status === TICKET_STATUS.USED
          ).length
      );

    const now = Date.now();

    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) =>
        q.eq("eventId", args.eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then(
        (entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
      );

    const totalReserved = purchasedCounts + activeOffers;

    return {
      isSoldOut: totalReserved >= event.totalTickets,
      totalTickets: event.totalTickets,
      purchasedCount: purchasedCounts,
      remainingTickets: Math.max(0, event.totalTickets - totalReserved),
      activeOffers,
    };
  },
});

export const checkAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const purchasedCount = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (t) =>
              t.status === TICKET_STATUS.VALID ||
              t.status === TICKET_STATUS.USED
          ).length
      );

    const now = Date.now();
    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) =>
        q.eq("eventId", args.eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then(
        (entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
      );

    const availSpots = event.totalTickets - (purchasedCount + activeOffers);
    return {
      available: availSpots > 0,
      availSpots,
      totalTickets: event.totalTickets,
      purchasedCount,
      activeOffers,
    };
  },
});

export const joinWaitingList = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Implement rate limiting
    // const status = await rateLimiter.limit(ctx, "queueJoin", {key: userId})

    const existingEntry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", args.userId).eq("eventId", args.eventId)
      )
      .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
      .first();

    if (existingEntry) {
      throw new Error("You are already in the queue for this event");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const { available } = await checkAvailability(ctx, {
      eventId: args.eventId,
    });

    const now = Date.now();

    if (available) {
      const waitingListId = await ctx.db.insert("waitingList", {
        eventId: args.eventId,
        userId: args.userId,
        status: WAITING_LIST_STATUS.OFFERED,
        offerExpiresAt: now + DURATIONS.TICKET_OFFER,
      });
      await ctx.scheduler.runAfter(
        DURATIONS.TICKET_OFFER,
        internal.waitingList.expireOffer,
        {
          waitingListId,
          eventId: args.eventId,
        }
      );
    } else {
      await ctx.db.insert("waitingList", {
        eventId: args.eventId,
        userId: args.userId,
        status: WAITING_LIST_STATUS.WAITING,
      });
    }

    return {
      success: true,
      status: available
        ? WAITING_LIST_STATUS.OFFERED
        : WAITING_LIST_STATUS.WAITING,
      message: available
        ? `Ticket offered - you will have ${DURATIONS.TICKET_OFFER / (60 * 1000)} minutes to purchase`
        : "You have been added to the waitlist, once the tickets are available you will be notified",
    };
  },
});
