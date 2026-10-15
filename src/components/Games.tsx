import { useRef } from "react";
import { FEATURED, PROJECTS, type Project } from "../data/content";

const GLYPH_NAME: Record<string, string> = { "!!": "Brilliant move", "!": "Good move", "!?": "Interesting move" };

/** Card that tilts toward the cursor and draws an analysis arrow on hover. */
function GameCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  // vary the arrow so the cards don't all draw the same line
  const arrows = ["M18 82 L50 50 L82 18", "M20 80 L20 30 L70 30", "M80 85 L45 50 L45 15", "M15 50 L50 50 L85 20"];
  const d = arrows[i % arrows.length];

  return (
    <article ref={ref} className="card" onPointerMove={move} onPointerLeave={leave}>
      <div className="card__media">
        {p.img ? (
          <img src={p.img} alt={`${p.name} screenshot`} loading="lazy" width="1200" height="585" />
        ) : (
          <div className="card__blank" aria-hidden="true"><span>♘</span></div>
        )}
        <svg className="card__arrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id={`ah${i}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto">
              <path d="M0 0L10 5L0 10z" />
            </marker>
          </defs>
          <path d={d} pathLength={1} markerEnd={`url(#ah${i})`} />
        </svg>
      </div>
      <div className="card__body">
        <p className="card__kind">{p.kind}</p>
        <h3 className="card__name">
          {p.url ? (
            <a href={p.url} target="_blank" rel="noopener">{p.name}<span className="sr"> (opens site)</span></a>
          ) : (
            p.name
          )}
        </h3>
        <p className="card__text">{p.text}</p>
        <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </article>
  );
}

export default function Games() {
  return (
    <section id="games" className="games" aria-labelledby="games-title">
      <div className="wrap">
        <h2 id="games-title" className="h2">Games worth replaying</h2>
        <p className="lede">The work I'm proudest of, starting with the one I'm in the middle of.</p>

        <article className="relay">
          <div className="relay__side">
            <pre className="pgn" aria-label="Project details">
              {FEATURED.pgn.map(([k, v]) => (
                <span key={k}>
                  [{k} <span className="pgn__v">"{v}"</span>]{"\n"}
                </span>
              ))}
            </pre>
            <h3 className="relay__name">{FEATURED.name}</h3>
            <p className="relay__summary">{FEATURED.summary}</p>
            <ul className="tags">{FEATURED.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <ol className="notes">
            {FEATURED.annotations.map((a) => (
              <li key={a.title} className="note">
                <abbr className="note__glyph" title={GLYPH_NAME[a.glyph]}>{a.glyph}</abbr>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <div className="cards">
          {PROJECTS.map((p, i) => <GameCard key={p.name} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
