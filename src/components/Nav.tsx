import { useEffect, useState } from "react";
import { PROFILE } from "../data/content";
import { onSoundChange, setSound, soundOn } from "../lib/sound";

export default function Nav() {
  const [sound, setS] = useState(soundOn());
  useEffect(() => {
    const off = onSoundChange(setS);
    return () => {
      off();
    };
  }, []);

  return (
    <header className="nav">
      <a className="nav__brand" href="#top" aria-label="Hassan Ali, back to top">
        <span className="glyph" aria-hidden="true">♞</span> Hassan Ali
      </a>
      <nav aria-label="Main">
        <a href="#story">Story</a>
        <a href="#games">Work</a>
        <a href="#contact">Contact</a>
        <button
          type="button"
          className="nav__sound"
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
          title={sound ? "Turn piece sounds off" : "Turn piece sounds on"}
        >
          Sound {sound ? "on" : "off"}
        </button>
        <a className="nav__cv" href={PROFILE.resume} target="_blank" rel="noopener">Résumé</a>
      </nav>
    </header>
  );
}
