import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Event date must be in the future"
    ),
  price: z.number().min(0, "Price must be 0 or greater"),
  totalTickets: z.number().min(1, "Must have at least 1 ticket"),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
