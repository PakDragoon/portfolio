import { PROFILE } from "../data/content";

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="contact__title">Your move.</h2>
        <p className="muted contact__lede">
          Hiring, or have something to build? Email is the fastest way to reach me.
        </p>
        <a className="contact__mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>

        <ul className="links">
          <li><a href={PROFILE.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href={PROFILE.github} target="_blank" rel="noopener">GitHub</a></li>
          <li><a href={PROFILE.whatsapp} target="_blank" rel="noopener">WhatsApp {PROFILE.phoneDisplay}</a></li>
          <li><a href={PROFILE.resume} target="_blank" rel="noopener">Résumé (PDF)</a></li>
        </ul>

        <footer className="foot">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <a href="#top">Back to the start</a>
        </footer>
      </div>
    </section>
  );
}
