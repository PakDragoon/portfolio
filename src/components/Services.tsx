import Tokens from "./Tokens";
import { PIPELINE, SERVICES } from "../data/content";
import { usePrefs } from "../lib/prefs";
import { useSeen } from "../lib/hooks";

export default function Services() {
  const { audience } = usePrefs();
  const [ref, seen] = useSeen<HTMLOListElement>(0.3);
  return (
    <section id="services" className="sec sec--ink">
      <div className="wrap">
        <Tokens text={audience === "client" ? "What I can build for you" : "What I bring to a team"} />
        <p className="sec__sub">
          {audience === "client"
            ? "Four kinds of work I take on, each backed by something I've already shipped."
            : "The same four areas I'd own on day one, each backed by something I've already shipped."}
        </p>
        <div className="svc">
          {SERVICES.map((s, i) => (
            <article key={s.name} className="svc__item">
              <span className="svc__head">fine-tune {String(i + 1).padStart(2, "0")}</span>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <p className="svc__proof"><span>Shipped</span>{s.proof}</p>
            </article>
          ))}
        </div>

        <h3 className="pipe__title">{audience === "client" ? "How a project runs" : "How I run a project"}</h3>
        <ol ref={ref} className={`pipe ${seen ? "is-on" : ""}`}>
          {PIPELINE.map(([name, text], i) => (
            <li key={name} style={{ ["--i" as string]: i }}>
              <span className="pipe__dot" aria-hidden="true" />
              <b>{name}</b>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
