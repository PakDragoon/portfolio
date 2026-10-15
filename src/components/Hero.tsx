import { PROFILE } from "../data/content";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__copy">
        <p className="hero__role">Software engineer in {PROFILE.location.split(",")[0]}</p>
        <h1 className="hero__name">Hassan<br />Ali</h1>
        <p className="hero__lede">
          I lead a five-person team building a multi-tenant SaaS on NestJS, React and AWS,
          and I bring AI into how we ship it. I play chess the same way I plan software:
          a few moves ahead.
        </p>
        <div className="hero__actions">
          <a className="btn" href="#work">See my work</a>
          <a className="btn btn--ghost" href={PROFILE.resume} target="_blank" rel="noopener">Download résumé</a>
        </div>
      </div>
      <a className="hero__cue" href="#career">Scroll to play the opening</a>
    </section>
  );
}
