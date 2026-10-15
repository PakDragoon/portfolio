import { STEPS } from "../data/content";

export default function Career({ active }: { active: number }) {
  return (
    <section id="career" className="career" aria-labelledby="career-title">
      <div className="career__intro">
        <h2 id="career-title" className="h2">My career, played as an opening</h2>
        <p className="muted">
          Six moves of the Italian Game, one for each step so far. Scroll and the board plays along.
        </p>
      </div>

      <ol className="moves">
        {STEPS.map((s, i) => (
          <li key={s.notation} data-step={i} className={`move ${i === active ? "move--active" : ""}`}>
            <div className="move__card">
              <p className="move__notation" aria-label={`Move ${i + 1}`}>{s.notation}</p>
              <p className="move__when">{s.when}</p>
              <h3 className="move__title">{s.title}</h3>
              {s.place && <p className="move__place">{s.place}</p>}
              <ul className="move__points">
                {s.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
