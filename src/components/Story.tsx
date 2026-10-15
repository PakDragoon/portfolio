import { CHAPTERS, OFF_THE_BOARD } from "../data/content";

export default function Story() {
  return (
    <section id="story" className="story" aria-labelledby="story-title">
      <div className="wrap">
        <h2 id="story-title" className="h2">How I got here</h2>
        <div className="chapters">
          {CHAPTERS.map((c) => (
            <article key={c.phase} className="chapter">
              <header className="chapter__head">
                <p className="chapter__move">{c.move}</p>
                <h3 className="chapter__phase">{c.phase}</h3>
                <p className="chapter__where">{c.where}</p>
                <p className="chapter__years">{c.years}</p>
              </header>
              <div className="chapter__body">
                {c.body.map((p) => <p key={p}>{p}</p>)}
              </div>
            </article>
          ))}
        </div>
        <p className="aside">{OFF_THE_BOARD}</p>
      </div>
    </section>
  );
}
