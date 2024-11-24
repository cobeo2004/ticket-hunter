import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
      });
      return existingUser._id;
    }

    const newUserId = await ctx.db.insert("users", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      stripeConnectId: undefined,
    });
    return newUserId;
  },
});

export const getStripeConnectIdFromUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.neq(q.field("stripeConnectId"), undefined))
      .first();

    return user?.stripeConnectId;
  },
});

export const linkStripeConnectIdToUser = mutation({
  args: {
    userId: v.string(),
    stripeConnectId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      stripeConnectId: args.stripeConnectId,
    });
  },
});
