import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function ReleaseTicket({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) {
  const relTicket = useMutation(api.waitingList.releaseTicket);
  const [releasing, setReleasing] = useState(false);

  const handleRelease = async () => {
    try {
      setReleasing(true);
      await relTicket({ eventId, waitingListId });
    } catch (error) {
      console.error("Error releasing ticket", error);
    } finally {
      setReleasing(false);
    }
  };

  return (
    <Button
      onClick={handleRelease}
      disabled={releasing}
      className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XCircle className="w-4 h-4" />
      {releasing ? "Releasing..." : "Release Ticket Offer"}
    </Button>
  );
}

export default ReleaseTicket;
