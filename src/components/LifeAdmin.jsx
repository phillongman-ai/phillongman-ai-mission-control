import React from "react";
import { renewals } from "../data/renewals";
import { daysUntil, renewalStatus, sortedRenewals } from "../lib/renewalEngine";
import { RagBadge } from "./RagBadge";

export function LifeAdmin({compact=false}){
  const items=compact?sortedRenewals(renewals).slice(0,3):sortedRenewals(renewals);
  return <section className="card">
    <div className="section-head">
      <div><h2>🧾 Life Admin</h2><div className="small">Insurance, contracts, renewals and other future commitments.</div></div>
      <RagBadge tone="amber">{items.length} tracked</RagBadge>
    </div>
    <div className="renewal-list">
      {items.map(item=>{
        const status=renewalStatus(item.expiry);
        const days=daysUntil(item.expiry);
        return <div className="renewal-row" key={item.id}>
          <div className="renewal-main"><div className="renewal-icon">{item.emoji}</div><div><strong>{item.name}</strong><div className="small">{item.provider} · {item.cost}</div></div></div>
          <div className="renewal-meta"><div className="renewal-days">{days<0?`${Math.abs(days)} days overdue`:`${days} days`}</div><div className="small">{new Date(item.expiry+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div><RagBadge tone={status.tone}>{status.label}</RagBadge></div>
        </div>
      })}
    </div>
  </section>
}
