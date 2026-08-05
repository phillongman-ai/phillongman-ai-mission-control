import React from "react";
import { daysBetween, parseDate, nearEvents, appToday } from "../lib/eventEngine";
import { RagBadge } from "./RagBadge";

export function FocusList({ events }) {
  const items = nearEvents(events);
  return (
    <section className="card">
      <div className="section-head">
        <h2>🎯 Today’s Focus</h2>
        <RagBadge tone="amber">{items.length} items</RagBadge>
      </div>
      {items.map((event) => {
        const days = daysBetween(appToday, parseDate(event.date));
        const when = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
        return (
          <div className="focus-row" key={event.id}>
            <div className="icon-orb">{event.emoji}</div>
            <div>
              <strong>{event.title}</strong>
              <div className="small">{when}{event.time ? ` · ${event.time}` : ""}</div>
            </div>
            <RagBadge tone={event.priority === "high" ? "amber" : "blue"}>
              {event.priority === "high" ? "Prepare" : "Upcoming"}
            </RagBadge>
          </div>
        );
      })}
    </section>
  );
}
