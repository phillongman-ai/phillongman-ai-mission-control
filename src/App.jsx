import React from "react";
import { useEffect, useMemo, useState } from "react";
import { events as baseEvents } from "./data/events";
import { profile } from "./data/profile";
import { nearEvents, ragForCategory } from "./lib/eventEngine";
import { MissionIndex } from "./components/MissionIndex";
import { FocusList } from "./components/FocusList";
import { CalendarMonth } from "./components/CalendarMonth";
import { SyncCentre } from "./components/SyncCentre";
import { LifeAdmin } from "./components/LifeAdmin";
import { RagBadge } from "./components/RagBadge";
import {
  Home, BriefcaseBusiness, Plane, Users, Dumbbell, WalletCards,
  Trophy, Clapperboard, ClipboardCheck, House, CalendarDays
} from "lucide-react";

const navItems = [
  { id:"home", emoji:"🏠", label:"Home", Icon:Home },
  { id:"calendar", emoji:"🗓️", label:"Calendar", Icon:CalendarDays },
  { id:"work", emoji:"💼", label:"Work", Icon:BriefcaseBusiness },
  { id:"travel", emoji:"✈️", label:"Travel", Icon:Plane },
  { id:"family", emoji:"👨‍👩‍👧‍👦", label:"Family", Icon:Users },
  { id:"fitness", emoji:"🎾", label:"Fitness", Icon:Dumbbell },
  { id:"money", emoji:"💷", label:"Money", Icon:WalletCards },
  { id:"football", emoji:"⚽", label:"Football", Icon:Trophy },
  { id:"entertainment", emoji:"🎬", label:"Entertainment", Icon:Clapperboard },
  { id:"admin", emoji:"🧾", label:"Life Admin", Icon:ClipboardCheck },
  { id:"life", emoji:"🏡", label:"Life & Home", Icon:House }
];

export default function App() {
  const [view, setView] = useState("home");
  const [privateMode, setPrivateMode] = useState(true);
  const [now, setNow] = useState(new Date());
  const [googleEvents, setGoogleEvents] = useState([]);

  const normalizeGoogleEvents = (items) => items
    .filter((item) => item?.start)
    .map((item) => {
      const start = new Date(item.start);
      const isTimed = String(item.start).includes("T");
      return {
        id: `google-${item.id}`,
        title: item.summary || "Google Calendar event",
        date: start.toISOString().slice(0, 10),
        time: isTimed
          ? start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          : "",
        category: "Calendar",
        priority: "medium",
        emoji: "📅",
        status: "synced",
        source: "google",
        location: item.location || ""
      };
    });

  const events = useMemo(() => {
    const merged = [...baseEvents, ...normalizeGoogleEvents(googleEvents)];
    return [...new Map(merged.map((event) => [event.id, event])).values()];
  }, [googleEvents]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const futurePhil = useMemo(
    () => nearEvents(events).slice(0, 3).map((event) => `${event.emoji} ${event.title}`),
    [events]
  );

  return (
    <div className={`app ${privateMode ? "privacy-on" : ""}`}>
      <aside>
        <div className="brand">Mission <span>Control</span></div>
        <div className="tag">Phil’s Personal OS</div>
        <nav>
          {navItems.map(({ id, emoji, label, Icon }) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
              <span className="nav-symbol" aria-hidden="true">
                <Icon size={19} strokeWidth={2.2} />
                <span className="nav-emoji">{emoji}</span>
              </span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button className="privacy-btn" onClick={() => setPrivateMode((value) => !value)}>
          {privateMode ? "👁 Privacy mode: ON" : "🙈 Privacy mode: OFF"}
        </button>
      </aside>

      <main>
        <header className="top">
          <div><h1>{view === "home" ? "Mission Control" : navItems.find((item) => item.id === view)?.label}</h1><div className="sub">Your personal operating system</div></div>
          <div className="datebox">
            <div>{now.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</div>
            <strong>{now.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}</strong>
          </div>
        </header>

        {view === "home" && (
          <div className="stack">
            <section className="card headline">
              <div className="eyebrow">Mission Control Brief</div>
              <div className="hero-title">👋 Good morning, Phil</div>
              <div className="small">{nearEvents(events).length} important items are coming up in the next 7 days.</div>
            </section>

            <MissionIndex events={events} />

            <div className="grid two">
              <FocusList events={events} />
              <section className="card">
                <div className="section-head"><h2>🔮 Future Phil Says</h2><RagBadge tone="blue">Worth doing</RagBadge></div>
                <div className="future-list">{futurePhil.map((item) => <div key={item}>{item}</div>)}</div>
              </section>
            </div>

            <div className="grid four">
              {["Work","Travel","Family","Fitness"].map((category) => {
                const rag = ragForCategory(events, category);
                const detail = {
                  Work:"Copilot handles the detail",
                  Travel:"Spain is next",
                  Family:"Emma and Sam",
                  Fitness:"Monday & Thursday padel"
                }[category];
                const emoji = {Work:"💼",Travel:"✈️",Family:"👨‍👩‍👧‍👦",Fitness:"🎾"}[category];
                return (
                  <section className="card status-card" key={category}>
                    <div className="status-emoji">{emoji}</div>
                    <div className="section-head"><div className="eyebrow">{category}</div><RagBadge tone={rag.tone}>{rag.label}</RagBadge></div>
                    <div className="status-title">{detail}</div>
                  </section>
                );
              })}
            </div>

            <LifeAdmin compact />
            <section className="calendar-divider">
              <span>🗓️</span>
              <div><strong>Your calendar</strong><div className="small">Personal dates, Google Calendar and renewals</div></div>
              <button className="secondary-btn" type="button" onClick={()=>setView("calendar")}>Open calendar</button>
            </section>
            <CalendarMonth events={events} />
            <SyncCentre onGoogleEvents={setGoogleEvents} />
          </div>
        )}

        {view === "calendar" && (
          <div className="stack">
            <HubHeader icon="🗓️" title="Calendar" subtitle="Your personal, Google and Life Admin events in one place." score={94} />
            <CalendarMonth events={events} />
            <section className="card">
              <div className="section-head">
                <h2>📅 Upcoming events</h2>
                <RagBadge tone="blue">{events.length} tracked</RagBadge>
              </div>
              <div className="rich-list">
                {[...events]
                  .sort((a,b)=>new Date(a.date)-new Date(b.date))
                  .slice(0,12)
                  .map((event)=><div key={event.id}>{event.emoji || "📌"} <strong>{event.title}</strong> · {new Date(event.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}{event.time ? ` · ${event.time}` : ""}</div>)}
              </div>
            </section>
          </div>
        )}
        {view === "work" && <WorkHub />}
        {view === "travel" && <TravelHub />}
        {view === "family" && <FamilyHub />}
        {view === "fitness" && <FitnessHub events={events} />}
        {view === "money" && <MoneyHub />}
        {view === "football" && <FootballHub />}
        {view === "entertainment" && <EntertainmentHub />}
        {view === "admin" && <LifeAdmin />}
        {view === "life" && <LifeHomeHub />}
      </main>
    </div>
  );
}


function HubHeader({ icon, title, subtitle, score, tone="green" }) {
  return (
    <section className="card hub-header">
      <div>
        <div className="eyebrow">{icon} {title}</div>
        <div className="hero-title small-hero">{subtitle}</div>
      </div>
      <div className="hub-score">
        <span>{score}%</span>
        <RagBadge tone={tone}>{tone === "green" ? "Ready" : "Attention"}</RagBadge>
      </div>
    </section>
  );
}

function WorkHub() {
  return <div className="stack">
    <HubHeader icon="💼" title="Work" subtitle="Your personal work companion, not a replacement for Copilot." score={96} />
    <div className="grid three">
      <section className="card"><div className="eyebrow">🤖 Primary AI</div><div className="hub-value">Microsoft Copilot</div><div className="small">Meetings, documents, email and internal content.</div></section>
      <section className="card"><div className="eyebrow">🏙 Office routine</div><div className="hub-value">Wednesday</div><div className="small">GLH, London · commute-heavy day.</div></section>
      <section className="card"><div className="eyebrow">📊 Focus</div><div className="hub-value">Insights & reporting</div><div className="small">KPI storytelling, p50–p99 and executive summaries.</div></section>
    </div>
    <section className="card"><h2>🎯 Current priorities</h2><div className="rich-list"><div>Monthly Change & Release reporting</div><div>Service delivery insights development</div><div>Keep work detail in Copilot; Mission Control tracks the personal headline.</div></div></section>
  </div>
}

function TravelHub() {
  return <div className="stack">
    <HubHeader icon="✈️" title="Travel" subtitle="Trips, countdowns, ideas and practical preparation." score={98} />
    <div className="grid three">
      <section className="card"><div className="eyebrow">Next trip</div><div className="hub-value">La Marina</div><div className="small">5–11 September 2026</div></section>
      <section className="card"><div className="eyebrow">Next major trip</div><div className="hub-value">Istanbul</div><div className="small">16 October 2026</div></section>
      <section className="card"><div className="eyebrow">Preferred drive</div><div className="hub-value">≤ 90 minutes</div><div className="small">Only for something genuinely magnificent.</div></section>
    </div>
    <div className="grid two">
      <section className="card"><h2>🗺 Standout Spain ideas</h2><div className="rich-list"><div>Tabarca Island</div><div>Calpe / Peñón views</div><div>El Pinet beach day</div></div></section>
      <section className="card"><h2>🧳 Preparation</h2><div className="rich-list"><div>Travel insurance valid until 4 October</div><div>Build packing checklist nearer departure</div><div>Weather feed coming next</div></div></section>
    </div>
  </div>
}

function FamilyHub() {
  return <div className="stack">
    <HubHeader icon="👨‍👩‍👧‍👦" title="Family" subtitle="People, milestones, appointments and things worth remembering." score={92} tone="amber" />
    <div className="grid two">
      {profile.family.map((person) => (
        <section className="card family-profile" key={person.name}>
          <div className="profile-icon">{person.emoji}</div>
          <div><div className="hub-value">{person.name}</div><div className="small">{person.relationship}</div>
          <div className="profile-detail">Born {new Date(person.birthday+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div></div>
        </section>
      ))}
    </div>
    <section className="card"><h2>❤️ Current family focus</h2><div className="rich-list"><div>Emma’s menopause clinician follow-up</div><div>Sam’s birthday milestone</div><div>Luna’s walks, grooming and wellbeing</div></div></section>
  </div>
}

function FitnessHub({ events }) {
  const padel = events.filter((event) => event.category === "Fitness").slice(0, 6);
  return <div className="stack">
    <HubHeader icon="🎾" title="Fitness" subtitle="Routine, consistency and eventually Samsung Health." score={88} tone="amber" />
    <div className="grid three">
      <section className="card"><div className="eyebrow">Weekly target</div><div className="hub-value">2 padel sessions</div><div className="small">Monday & Thursday · 18:30</div></section>
      <section className="card"><div className="eyebrow">Bookings</div><div className="hub-value">Matchi</div><div className="small">Court booking app</div></section>
      <section className="card"><div className="eyebrow">Group comms</div><div className="hub-value">WhatsApp</div><div className="small">Players and attendance</div></section>
    </div>
    <section className="card"><h2>🎾 Upcoming padel</h2>{padel.map((event)=><div className="list-row" key={event.id}><span>{new Date(event.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}</span><strong>{event.time}</strong></div>)}</section>
    <section className="card"><h2>⌚ Samsung Health roadmap</h2><div className="rich-list"><div>Steps and active minutes</div><div>Sleep and heart rate</div><div>Exercise sessions and recovery trends</div></div></section>
  </div>
}

function MoneyHub() {
  return <div className="stack">
    <HubHeader icon="💷" title="Money" subtitle="Private by default, useful when you choose to reveal it." score={95} />
    <div className="grid three">
      <section className="card"><div className="eyebrow">🏦 Pension</div><div className="sensitive hub-value">£{profile.money.pension.toLocaleString("en-GB")}</div><div className="small">Long-term retirement focus</div></section>
      <section className="card"><div className="eyebrow">🎟 Premium Bonds</div><div className="sensitive hub-value">£{profile.money.premiumBonds.toLocaleString("en-GB")}</div></section>
      <section className="card"><div className="eyebrow">💰 Savings</div><div className="sensitive hub-value">£{profile.money.savings.toLocaleString("en-GB")}</div></section>
    </div>
    <section className="card"><h2>📈 Financial priorities</h2><div className="rich-list"><div>Model pension contributions at 8% and 10%</div><div>Track Sharesave maturity</div><div>Keep renewals in Life Admin</div></div></section>
  </div>
}

function FootballHub() {
  return <div className="stack">
    <HubHeader icon="⚽" title="Football" subtitle="Spurs, Fantasy Football and credible intelligence." score={93} />
    <div className="grid two">
      <section className="card"><div className="eyebrow">⚽ Spurs</div><div className="hub-value">Transfer watch</div><div className="small">Credible moves, squad planning and fixtures.</div></section>
      <section className="card"><div className="eyebrow">📊 Fantasy Football</div><div className="hub-value">Data-led edge</div><div className="small">Competitive from Gameweek 1.</div></section>
    </div>
    <section className="card"><h2>🔍 Current watchlist</h2><div className="rich-list"><div>Kinsky and pre-season form</div><div>New Spurs signings</div><div>FPL differentials and captaincy</div></div></section>
  </div>
}

function EntertainmentHub() {
  return <div className="stack">
    <HubHeader icon="🎬" title="Entertainment" subtitle="Recommendations trained on your actual taste." score={97} />
    <div className="grid three">
      <section className="card"><div className="eyebrow">Tonight</div><div className="hub-value">Mr Inbetween</div><div className="small">Strong match for grounded crime drama.</div></section>
      <section className="card"><div className="eyebrow">Top taste</div><div className="hub-value">Gritty drama</div><div className="small">Character-led, authentic, high stakes.</div></section>
      <section className="card"><div className="eyebrow">Reality favourite</div><div className="hub-value">Below Deck</div><div className="small">Workplace dynamics and authentic characters.</div></section>
    </div>
    <section className="card"><h2>⭐ Your benchmark shows</h2><div className="rich-list"><div>Breaking Bad · 10/10</div><div>Top Boy · 10/10</div><div>Yellowstone · 10/10</div><div>Landman · 10/10</div></div></section>
  </div>
}

function LifeHomeHub() {
  const [note, setNote] = useState(localStorage.getItem("missionControlNote") || "");
  const [saved, setSaved] = useState("");
  return <div className="stack">
    <HubHeader icon="🏡" title="Life & Home" subtitle="Projects, routines, wellbeing and personal notes." score={94} />
    <div className="grid two">
      <section className="card"><div className="eyebrow">🏠 Home</div><div className="hub-value">Modernisation</div><div className="small">Door, porch and future improvements.</div></section>
      <section className="card"><div className="eyebrow">❤️ Wellbeing</div><div className="hub-value">Balance & consistency</div><div className="small">Health, family, work and enjoyable plans.</div></section>
    </div>
    <section className="card"><h2>📝 Personal note</h2><textarea value={note} onChange={(event)=>setNote(event.target.value)} placeholder="Add something Mission Control should remember on this device..." /><button className="primary-btn" onClick={()=>{localStorage.setItem("missionControlNote",note);setSaved("Saved on this device.");}}>Save note</button><div className="small">{saved}</div></section>
  </div>
}

function SimpleGrid({ items }) {
  return <div className="grid two">{items.map(([label,title,detail]) => <section className="card" key={label}><div className="eyebrow">{label}</div><div className="hero-title small-hero">{title}</div><div className="small">{detail}</div></section>)}</div>;
}

function FamilyPage() {
  return <div className="grid two">{profile.family.map((person) => <section className="card" key={person.name}><div className="hero-title small-hero">{person.emoji} {person.name}</div><div className="small">{person.relationship} · born {new Date(person.birthday+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div></section>)}</div>;
}

function FitnessPage({ events }) {
  const padel = events.filter((event) => event.category === "Fitness");
  return <div className="stack"><div className="grid two"><section className="card"><div className="eyebrow">📆 Weekly routine</div><div className="hero-title small-hero">Monday & Thursday</div><div className="small">Padel at 18:30.</div></section><section className="card"><div className="eyebrow">📱 Apps</div><div className="hero-title small-hero">Matchi + WhatsApp</div><div className="small">Bookings and group comms.</div></section></div><section className="card"><h2>🎾 Upcoming padel</h2>{padel.map((event) => <div className="list-row" key={event.id}><span>{new Date(event.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}</span><strong>{event.time}</strong></div>)}</section></div>;
}

function MoneyPage() {
  return <div className="grid two"><section className="card"><div className="eyebrow">🏦 Pension</div><div className="sensitive hero-title small-hero">£{profile.money.pension.toLocaleString("en-GB")}</div></section><section className="card"><div className="eyebrow">💰 Accessible savings</div><div className="sensitive hero-title small-hero">£{(profile.money.premiumBonds+profile.money.savings).toLocaleString("en-GB")}</div></section></div>;
}

function NotesPage() {
  const [note, setNote] = useState(localStorage.getItem("missionControlNote") || "");
  const [saved, setSaved] = useState("");
  return <section className="card"><h2>📝 Personal note</h2><textarea value={note} onChange={(event)=>setNote(event.target.value)} placeholder="Add something Mission Control should remember on this device..." /><button className="primary-btn" onClick={()=>{localStorage.setItem("missionControlNote",note);setSaved("Saved on this device.");}}>Save note</button><div className="small">{saved}</div></section>;
}
