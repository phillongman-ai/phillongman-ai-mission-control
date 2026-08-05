export const appToday = new Date("2026-08-05T12:00:00+01:00");

export function parseDate(value) {
  return new Date(`${value}T12:00:00+01:00`);
}

export function daysBetween(a, b) {
  return Math.ceil((b - a) / 86400000);
}

export function upcoming(events) {
  return [...events]
    .filter((event) => parseDate(event.date) >= appToday)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

export function nearEvents(events, days = 7) {
  return upcoming(events).filter((event) => daysBetween(appToday, parseDate(event.date)) <= days);
}

export function missionIndex(events) {
  const penalties = { high: 3, medium: 1, low: 0 };
  const penalty = nearEvents(events).reduce((total, event) => total + (penalties[event.priority] ?? 0), 0);
  return Math.max(70, 100 - penalty);
}

export function ragForCategory(events, category) {
  const relevant = nearEvents(events).filter((event) => event.category === category);
  if (relevant.some((event) => event.priority === "high")) return { tone: "amber", label: "Attention" };
  if (relevant.length) return { tone: "blue", label: "Upcoming" };
  return { tone: "green", label: "Green" };
}
