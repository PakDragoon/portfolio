import { useState } from "react";
import Tokens from "./Tokens";
import { ATTENTION, ATTN_PROJECTS, PROJECTS, SKILLS } from "../data/content";

/* Skills x projects as an attention matrix. Hover a skill or a project to see where it attends. */

export default function Attention({ onOpen }: { onOpen: (id: string) => void }) {
  const [row, setRow] = useState<number | null>(null);
  const [col, setCol] = useState<number | null>(null);
  const names = ATTN_PROJECTS.map((id) => PROJECTS.find((p) => p.id === id)!.name);

  const caption =
    row !== null
      ? `${SKILLS[row]} attends most to ${names[ATTENTION[row].indexOf(Math.max(...ATTENTION[row]))]}.`
      : col !== null
        ? `${names[col]} was built mostly with ${SKILLS.map((s, i) => [s, ATTENTION[i][col]] as const).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s).join(", ")}.`
        : "Hover a skill or a project.";

  return (
    <section id="attention" className="sec sec--tint">
      <div className="wrap">
        <Tokens text="Where each skill attends" />
        <p className="sec__sub">Rows are skills, columns are projects. Darker cells mean the skill carried more of that project.</p>
        <div className="attn" onMouseLeave={() => { setRow(null); setCol(null); }}>
          <div className="attn__grid" role="table" aria-label="Skills by project" style={{ ["--cols" as string]: ATTN_PROJECTS.length }}>
            <div className="attn__corner" role="presentation" />
            {names.map((n, j) => (
              <button
                key={n}
                className={`attn__col ${col === j ? "is-on" : ""}`}
                role="columnheader"
                onMouseEnter={() => { setCol(j); setRow(null); }}
                onFocus={() => { setCol(j); setRow(null); }}
                onClick={() => onOpen(ATTN_PROJECTS[j])}
                title={`Open ${n}`}
              >
                <span>{n}</span>
              </button>
            ))}
            {SKILLS.map((s, i) => (
              <div className="attn__row" role="row" key={s}>
                <span
                  className={`attn__skill ${row === i ? "is-on" : ""}`}
                  role="rowheader"
                  tabIndex={0}
                  onMouseEnter={() => { setRow(i); setCol(null); }}
                  onFocus={() => { setRow(i); setCol(null); }}
                >
                  {s}
                </span>
                {ATTENTION[i].map((v, j) => {
                  const lit = (row === null && col === null) || row === i || col === j;
                  return (
                    <span
                      key={j}
                      role="cell"
                      className={`attn__cell ${lit ? "" : "is-dim"}`}
                      style={{ ["--v" as string]: v }}
                      onMouseEnter={() => { setRow(i); setCol(j); }}
                      aria-label={`${s} in ${names[j]}: ${v.toFixed(1)}`}
                    >
                      <em>{v > 0 ? v.toFixed(1) : ""}</em>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="attn__cap" aria-live="polite">{caption}</p>
        </div>
      </div>
    </section>
  );
}
