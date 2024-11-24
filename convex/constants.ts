import { Doc } from "./_generated/dataModel";

export const DURATIONS = {
  TICKET_OFFER: 30 * 60 * 1000,
} as const;

export const WAITING_LIST_STATUS: Record<
  Uppercase<Doc<"waitingList">["status"]>,
  Doc<"waitingList">["status"]
> = {
  WAITING: "waiting",
  OFFERED: "offered",
  PURCHASED: "purchased",
  EXPIRED: "expired",
} as const;

export const TICKET_STATUS: Record<
  Uppercase<Doc<"tickets">["status"]>,
  Doc<"tickets">["status"]
> = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;