import { useMemo, useState } from "react";
import Tokens from "./Tokens";
import { CLUSTERS, PROJECTS, type Project } from "../data/content";

/* Projects plotted in a 2D "embedding space". Similar work sits close together.
 * Hover a point to see its nearest neighbours; click to open the case study. */

const dist = (a: Project, b: Project) => Math.hypot(a.pos[0] - b.pos[0], a.pos[1] - b.pos[1]);

export default function Work({ onOpen }: { onOpen: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const featured = PROJECTS.filter((p) => p.featured);
  const shipped = PROJECTS.filter((p) => p.shipped);
  const rest = PROJECTS.filter((p) => !p.featured && !p.shipped);

  const neighbours = useMemo(() => {
    if (!hover) return [];
    const h = PROJECTS.find((p) => p.id === hover)!;
    return PROJECTS.filter((p) => p.id !== hover).sort((a, b) => dist(a, h) - dist(b, h)).slice(0, 2);
  }, [hover]);
  const H = hover ? PROJECTS.find((p) => p.id === hover) : null;

  return (
    <section id="work" className="sec">
      <div className="wrap">
        <Tokens text="Selected work" />
        <p className="sec__sub">Two projects I'd walk any interviewer or client through, two tools I've published, then everything else, mapped by similarity.</p>

        <div className="feat">
          {featured.map((p, i) => (
            <button key={p.id} className="feat__card" onClick={() => onOpen(p.id)}>
              <span className="feat__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="feat__kind">{p.kind}</span>
              <span className="feat__name">{p.name}</span>
              <span className="feat__sum">{p.summary}</span>
              <span className="feat__role">{p.role}</span>
              <span className="chips chips--inline">{p.stack.slice(0, 6).map((s) => <i key={s}>{s}</i>)}</span>
              <span className="feat__open">Read the case study</span>
            </button>
          ))}
        </div>

        <div className="ship">
          <p className="ship__label"><i aria-hidden="true" />Published on the Chrome Web Store</p>
          <div className="ship__grid">
            {shipped.map((p) => (
              <article key={p.id} className="ship__card">
                <button className="ship__open" onClick={() => onOpen(p.id)} aria-label={`${p.name}: read the case study`}>
                  {p.img && <img className="ship__img" src={p.img} alt="" width="1200" height="585" loading="lazy" />}
                  <span className="ship__kind">{p.kind}</span>
                  <span className="ship__name">{p.name}</span>
                  <span className="ship__sum">{p.summary}</span>
                </button>
                <div className="ship__links">
                  <a className="btn btn--hot btn--sm" href={p.shipped!.store} target="_blank" rel="noopener">Add to Chrome</a>
                  <a className="btn btn--ghost btn--sm" href={p.shipped!.video} target="_blank" rel="noopener">Watch the demo</a>
                  <a className="ship__src" href={p.shipped!.source} target="_blank" rel="noopener">Source on GitHub</a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="emb">
          <div className="emb__map" onMouseLeave={() => setHover(null)}>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="emb__lines" aria-hidden="true">
              {H &&
                neighbours.map((n) => (
                  <line key={n.id} x1={H.pos[0] * 100} y1={H.pos[1] * 70} x2={n.pos[0] * 100} y2={n.pos[1] * 70} vectorEffect="non-scaling-stroke" />
                ))}
            </svg>
            {Object.entries(CLUSTERS).map(([k, c]) => (
              <span key={k} className="emb__cluster" style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}>{c.label}</span>
            ))}
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                className={`emb__pt ${p.featured ? "is-feat" : ""} ${hover === p.id ? "is-hover" : ""} ${neighbours.some((n) => n.id === p.id) ? "is-near" : ""}`}
                style={{ left: `${p.pos[0] * 100}%`, top: `${p.pos[1] * 100}%` }}
                onMouseEnter={() => setHover(p.id)}
                onFocus={() => setHover(p.id)}
                onClick={() => onOpen(p.id)}
              >
                <i aria-hidden="true" />
                <span>{p.name}</span>
              </button>
            ))}
            <p className="emb__axis">2D projection of project embeddings</p>
          </div>

          <ul className="emb__list">
            {rest.map((p) => (
              <li key={p.id}>
                <button className={hover === p.id ? "is-hover" : ""} onMouseEnter={() => setHover(p.id)} onFocus={() => setHover(p.id)} onClick={() => onOpen(p.id)}>
                  <b>{p.name}</b>
                  <span>{p.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
