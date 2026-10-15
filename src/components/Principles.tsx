import { PRINCIPLES, REPERTOIRE } from "../data/content";

const GLYPHS = ["♟", "♞", "♚", "♝"];

export default function Principles() {
  return (
    <section id="how" className="how" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title" className="h2">Opening principles I still follow</h2>
        <ul className="principles">
          {PRINCIPLES.map(([title, text], i) => (
            <li key={title}>
              <span className="principles__glyph" aria-hidden="true">{GLYPHS[i]}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>

        <h3 className="h3">My repertoire</h3>
        <dl className="repertoire">
          {REPERTOIRE.map(([group, items]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
