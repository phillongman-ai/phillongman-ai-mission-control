import React from "react";
import { missionIndex, nearEvents } from "../lib/eventEngine";
import { RagBadge } from "./RagBadge";

export function MissionIndex({ events }) {
  const score = missionIndex(events);
  const near = nearEvents(events);
  return (
    <section className="card index-card">
      <div className="index-left">
        <div className="eyebrow">🟢 Readiness Score</div>
        <div className="index-score">{score}%</div>
        <RagBadge tone={score >= 90 ? "green" : "amber"}>{score >= 90 ? "Excellent" : "Good"}</RagBadge>
      </div>
      <div>
        <p className="index-message">
          <strong>Everything important is accounted for.</strong><br />
          {near.length
            ? `${near.length} upcoming items deserve some attention, but nothing is out of control.`
            : "Nothing urgent is coming up."}
        </p>
        <div className="track"><div className="fill" style={{ width: `${score}%` }} /></div>
      </div>
    </section>
  );
}
