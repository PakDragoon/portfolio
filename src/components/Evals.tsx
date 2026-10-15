import Tokens from "./Tokens";
import { EVALS } from "../data/content";
import { useSeen } from "../lib/hooks";

export default function Evals() {
  const [ref, seen] = useSeen<HTMLDivElement>(0.2);
  return (
    <section id="evals" className="sec sec--tint">
      <div className="wrap">
        <Tokens text="Evaluation results" />
        <p className="sec__sub">Measured outcomes from real projects. Bars show relative impact, not a shared scale.</p>
        <div ref={ref} className={`evals ${seen ? "is-on" : ""}`} role="table" aria-label="Evaluation results">
          <div className="evals__row evals__row--head" role="row">
            <span role="columnheader">Benchmark</span>
            <span role="columnheader">Score</span>
            <span role="columnheader" className="evals__srccol">Source</span>
          </div>
          {EVALS.map((e, i) => (
            <div key={e.name} className="evals__row" role="row" style={{ ["--b" as string]: e.bar, ["--d" as string]: `${i * 90}ms` }}>
              <span role="cell" className="evals__name">
                {e.name}
                <small>{e.note}</small>
                <i className="evals__bar" aria-hidden="true" />
              </span>
              <span role="cell" className="evals__score">{e.score}</span>
              <span role="cell" className="evals__src">{e.src}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
