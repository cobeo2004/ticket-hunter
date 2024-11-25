import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { AlertCircle } from "lucide-react";
import EventForm from "@/app/seller/_components/EventForm";
import Spinner from "@/components/Spinner";

async function EditEventPage(
  p: Promise<{
    params: { id: string };
  }>
) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  const { id } = await (await p).params;
  const event = await preloadQuery(api.events.getEventById, {
    eventId: id as Id<"events">,
  });
  if (!event) {
    redirect("/seller/events");
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <p className="text-blue-100 mt-2">Update your event details</p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Note: If you modify the total number of tickets, any tickets
                already sold will remain valid. You can only increase the total
                number of tickets, not decrease it below the number of tickets
                already sold.
              </p>
            </div>
          </div>

          <Suspense fallback={<Spinner />}>
            <EventForm mode="edit" prefetchData={event} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;
