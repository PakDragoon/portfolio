import { useEffect, useRef } from "react";
import { PROJECTS } from "../data/content";
import { usePrefs } from "../lib/prefs";

function RelayDiagram() {
  return (
    <figure className="diag">
      <svg viewBox="0 0 560 300" role="img" aria-labelledby="dg-t dg-d">
        <title id="dg-t">Relay architecture</title>
        <desc id="dg-d">A React app calls a NestJS API on ECS. The API uses PostgreSQL and hands heavy jobs to BullMQ workers on Redis. Workers stream progress to the browser through Pusher. The API syncs with dealer management systems.</desc>
        <defs>
          <marker id="dg-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker>
        </defs>
        <g className="diag__box">
          <rect x="20" y="20" width="160" height="52" rx="10" /><text x="100" y="51">React 19 web app</text>
          <rect x="20" y="124" width="160" height="52" rx="10" className="diag__hot" /><text x="100" y="155">NestJS API (ECS)</text>
          <rect x="20" y="228" width="160" height="52" rx="10" /><text x="100" y="259">PostgreSQL (RDS)</text>
          <rect x="230" y="124" width="150" height="52" rx="10" /><text x="305" y="148">BullMQ workers</text><text x="305" y="164" className="diag__sm">Redis lock per dept</text>
          <rect x="230" y="20" width="150" height="52" rx="10" /><text x="305" y="51">Pusher</text>
          <rect x="420" y="124" width="120" height="52" rx="10" /><text x="480" y="148">Dealer systems</text><text x="480" y="164" className="diag__sm">Reynolds, Fortellis</text>
        </g>
        <g className="diag__lines" markerEnd="url(#dg-a)">
          <path d="M100 72v48" /><path d="M100 176v48" /><path d="M180 150h46" /><path d="M305 124V76" /><path d="M230 46h-46" /><path d="M380 150h36" />
        </g>
      </svg>
      <figcaption>Preview runs: API enqueues, worker runs the real scheduler in a transaction that rolls back, progress streams back through Pusher.</figcaption>
    </figure>
  );
}

export default function CaseDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { t } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);
  const p = PROJECTS.find((x) => x.id === id);

  useEffect(() => {
    if (!id) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    document.documentElement.classList.add("lock");
    return () => {
      window.removeEventListener("keydown", key);
      document.documentElement.classList.remove("lock");
      prev?.focus?.();
    };
  }, [id, onClose]);

  return (
    <div className={`drawer ${p ? "is-open" : ""}`} aria-hidden={!p} onClick={(e) => e.target === e.currentTarget && onClose()}>
      {p && (
        <div data-lenis-prevent className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="dr-title" tabIndex={-1} ref={ref}>
          <button className="drawer__x" onClick={onClose} aria-label="Close case study">Close</button>
          <p className="drawer__kind">{p.kind}{p.year ? `, ${p.year}` : ""}{p.where ? `, ${p.where}` : ""}</p>
          <h2 id="dr-title" className="drawer__title">{p.name}</h2>
          <p className="drawer__role"><span>My role</span>{p.role}</p>
          {p.img && <img className="drawer__img" src={p.img} alt={`${p.name} screenshot`} width="1200" height="585" />}
          {p.id === "relay" && <RelayDiagram />}
          <p className="drawer__body">{t(p.body)}</p>
          <h3 className="drawer__h">What I'd point out</h3>
          <ul className="drawer__list">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <h3 className="drawer__h">Stack</h3>
          <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          {p.shipped && (
            <>
              <h3 className="drawer__h">Demo</h3>
              <div className="drawer__video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${new URL(p.shipped.video).searchParams.get("v")}?rel=0`}
                  title={`${p.name} demo video`}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="drawer__links">
                <a className="btn btn--hot" href={p.shipped.store} target="_blank" rel="noopener">Add to Chrome</a>
                <a className="btn btn--ghost" href={p.shipped.source} target="_blank" rel="noopener">Source on GitHub</a>
              </div>
            </>
          )}
          {p.url && (
            <a className="btn drawer__visit" href={p.url} target="_blank" rel="noopener">Visit {p.url.replace(/^https?:\/\//, "")}</a>
          )}
        </div>
      )}
    </div>
  );
}
