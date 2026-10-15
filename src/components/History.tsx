import { useState } from "react";
import Tokens from "./Tokens";
import { EDUCATION, JOBS } from "../data/content";
import { usePrefs } from "../lib/prefs";

export default function History() {
  const { t, depth } = usePrefs();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="history" className="sec">
      <div className="wrap">
        <Tokens text="Training history" />
        <p className="sec__sub">Five years, three companies. The weight shows how much each run shapes the work I do today.</p>
        <ol className="runs">
          {JOBS.map((j, i) => {
            const isOpen = open === i || depth === "detailed";
            return (
              <li key={j.org} className={`run ${isOpen ? "is-open" : ""}`}>
                <button className="run__head" aria-expanded={isOpen} onClick={() => setOpen(open === i ? null : i)}>
                  <span className="run__when">{j.when}</span>
                  <span className="run__title">
                    <b>{j.role}</b> <span>{j.org}, {j.place}</span>
                  </span>
                  <span className="run__w" aria-label={`weight ${j.weight}`}>
                    <i style={{ ["--w" as string]: j.weight }} />
                    {j.weight.toFixed(2)}
                  </span>
                </button>
                <div className="run__body">
                  <div className="run__inner">
                    <p className="run__sum">{t(j.summary)}</p>
                    <ul className="run__pts">{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    <ul className="chips">{j.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="runs__edu">{EDUCATION}</p>
      </div>
    </section>
  );
}
