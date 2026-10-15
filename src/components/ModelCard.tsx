import Tokens from "./Tokens";
import { EDUCATION, MODEL_CARD, PROFILE } from "../data/content";
import { usePrefs } from "../lib/prefs";

export default function ModelCard() {
  const { t } = usePrefs();
  return (
    <section id="about" className="sec">
      <div className="wrap">
        <Tokens text="The model card" />
        <p className="sec__sub">Every model ships with a card describing what it's for and how it was trained. Here's mine.</p>
        <article className="card">
          <header className="card__head">
            <div>
              <p className="card__id">{MODEL_CARD.id}</p>
              <h3 className="card__title">{PROFILE.name}</h3>
              <p className="card__role">{PROFILE.title}, {PROFILE.company}</p>
            </div>
            <span className="card__ver">{MODEL_CARD.version}</span>
          </header>
          <p className="card__summary">{t(MODEL_CARD.summary)}</p>
          <dl className="card__rows">
            {MODEL_CARD.rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt>Education</dt>
              <dd>{EDUCATION}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
