import { useEffect, useState } from "react";
import { PROFILE } from "../data/content";
import { usePrefs } from "../lib/prefs";

export const SECTIONS: [string, string][] = [
  ["top", "Input"],
  ["about", "Model card"],
  ["evals", "Evals"],
  ["history", "Training"],
  ["work", "Work"],
  ["services", "Services"],
  ["ask", "Ask"],
  ["contact", "Contact"],
];

export default function Nav() {
  const { depth, setDepth } = usePrefs();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <a className="nav__brand" href="#top" aria-label="Hassan Ali, back to top">
        <span className="nav__mark" aria-hidden="true">ha</span>
        <span className="nav__name">Hassan Ali</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#ask">Ask</a>
      </nav>
      <div className="nav__ctl">
        <div className="temp" role="group" aria-label="Reading depth">
          <span className="temp__label">temperature</span>
          <button aria-pressed={depth === "concise"} onClick={() => setDepth("concise")} title="Concise: the short version of everything">0.2</button>
          <button aria-pressed={depth === "detailed"} onClick={() => setDepth("detailed")} title="Detailed: the full story">0.8</button>
        </div>
        <a className="nav__cta" href="#contact">Contact</a>
        <a className="nav__cv" href={PROFILE.resume} target="_blank" rel="noopener">Résumé</a>
      </div>
    </header>
  );
}
