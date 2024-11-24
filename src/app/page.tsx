import React from "react";
import EventList from "./_components/EventList";
import { api } from "../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
async function Home() {
  const events = await preloadQuery(api.events.getEvents);
  return (
    <div>
      <EventList preloadedEvents={events} />
    </div>
  );
}

export default Home;
