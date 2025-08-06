import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

/**
 * EventContext handles creation, joining and listing of events by
 * communicating with the backend. It maintains an in-memory list of
 * events for the current session. For real-time updates consider
 * integrating Firebase or WebSockets.
 */

interface Event {
  id: number;
  name: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  creator_id: number;
  created_at: string;
}

interface EventContextValue {
  events: Event[];
  refreshEvents: () => Promise<void>;
  createEvent: (eventData: Partial<Event> & { creator_id: string }) => Promise<Event | null>;
  joinEvent: (eventId: string, userId: string) => Promise<boolean>;
}

const EventContext = createContext<EventContextValue | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const refreshEvents = useCallback(async () => {
    const res = await fetch(`/backend/events.php?action=list`);
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events);
    }
  }, []);

  const createEvent = async (eventData: Partial<Event> & { creator_id: string }) => {
    const res = await fetch(`/backend/events.php?action=create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      const data = await res.json();
      const newEvent: Event = {
        id: data.event_id,
        name: eventData.name ?? "",
        description: eventData.description,
        location: eventData.location,
        start_time: eventData.start_time ?? new Date().toISOString(),
        end_time: eventData.end_time,
        creator_id: Number(eventData.creator_id),
        created_at: new Date().toISOString(),
      };
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    }
    return null;
  };

  const joinEvent = async (eventId: string, userId: string) => {
    const res = await fetch(`/backend/events.php?action=join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: eventId, user_id: userId }),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
    return false;
  };

  return (
    <EventContext.Provider value={{ events, refreshEvents, createEvent, joinEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};