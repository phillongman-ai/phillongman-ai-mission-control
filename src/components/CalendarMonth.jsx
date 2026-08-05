import React from "react";
export function CalendarMonth({ events }) {
  const start = new Date("2026-07-27T12:00:00+01:00");
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>🗓️ August 2026</h2>
          <div className="small">Rendered from the shared event engine.</div>
        </div>
        <RagBadgeLocal />
      </div>
      <div className="calendar-head">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="calendar-grid">
        {days.map((date) => {
          const key = date.toISOString().slice(0, 10);
          const dayEvents = events.filter((event) => event.date === key);
          const muted = date.getMonth() !== 7;
          const today = key === "2026-08-05";
          return (
            <div key={key} className={`day ${muted ? "muted" : ""} ${today ? "today" : ""}`}>
              <div className="day-number">{date.getDate()}</div>
              {dayEvents.map((event) => (
                <span key={event.id} className={`event-chip event-${event.category.toLowerCase()}`}>
                  {event.emoji} {event.title}{event.time ? ` · ${event.time}` : ""}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RagBadgeLocal() {
  return <span className="rag rag-blue">Event engine</span>;
}
