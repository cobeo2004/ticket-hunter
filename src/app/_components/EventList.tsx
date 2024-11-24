"use client";

import React from "react";
import { api } from "../../../convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Spinner from "@/components/Spinner";
import { CalendarDays, Ticket } from "lucide-react";
import EventCard from "./EventCard";

function EventList({
  preloadedEvents,
}: {
  preloadedEvents: Preloaded<typeof api.events.getEvents>;
}) {
  const events = usePreloadedQuery(preloadedEvents);
  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const upcomingEvents = events.filter((event) => event.eventDate > Date.now());
  const pastEvents = events.filter((event) => event.eventDate < Date.now());
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between font-bold">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover & book tickets for amazing events
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">
              {upcomingEvents.length} upcoming events
            </span>
          </div>
        </div>
      </div>
      {/* Upcoming Events Grid*/}
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 mt-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg text-center p-12 mb-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming events
          </h3>
          <p className="mt-1 text-gray-600">
            Check back soon for exciting events!
          </p>
        </div>
      )}
      {/* Past Events Grid */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Past Events</h1>
      </div>
      {pastEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pastEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg text-center p-12 mb-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No past events</h3>
          <p className="mt-1 text-gray-600">
            Check back soon for exciting events!
          </p>
        </div>
      )}
    </div>
  );
}

export default EventList;
