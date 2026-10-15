import { SKILLS } from "../data/content";

export default function Toolkit() {
  return (
    <section id="toolkit" className="toolkit" aria-labelledby="toolkit-title">
      <div className="wrap">
        <h2 id="toolkit-title" className="h2">Toolkit</h2>
        <dl className="kit">
          {SKILLS.map(([group, items]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <p className="muted kit__edu">B.Sc. Computer Engineering, The University of Lahore</p>
      </div>
    </section>
  );
}
