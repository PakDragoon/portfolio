import { useEffect, useState } from "react";
import BoardCanvas from "./components/BoardCanvas";
import Hero from "./components/Hero";
import Career from "./components/Career";
import Work from "./components/Work";
import Toolkit from "./components/Toolkit";
import Contact from "./components/Contact";
import { PROFILE, STEPS } from "./data/content";

/**
 * Tracks what sits at the middle of the viewport:
 * the hero, one of the career steps, or the solid sections after them.
 */
function useStage() {
  const [stage, setStage] = useState<{ zone: "hero" | "career" | "after"; step: number }>({ zone: "hero", step: -1 });

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      const after = document.getElementById("work");
      if (after && after.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setStage((s) => (s.zone === "after" ? s : { zone: "after", step: STEPS.length - 1 }));
        return;
      }
      const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
      let step = -1;
      steps.forEach((el, i) => {
        if (el.getBoundingClientRect().top < mid) step = i;
      });
      const zone = step >= 0 ? "career" : "hero";
      setStage((s) => (s.zone === zone && s.step === step ? s : { zone, step }));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return stage;
}

export default function App() {
  const stage = useStage();
  const ply = stage.step < 0 ? 0 : (stage.step + 1) * 2;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <BoardCanvas ply={ply} mode={stage.zone === "hero" ? "hero" : "game"} shown={stage.zone !== "after"} />

      <header className="topbar">
        <a className="mark" href="#top" aria-label="Hassan Ali, back to top">HA</a>
        <nav aria-label="Main">
          <a href="#career">Career</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a className="pill" href={PROFILE.resume} target="_blank" rel="noopener">Résumé</a>
        </nav>
      </header>

      <main id="main">
        <Hero />
        <Career active={stage.zone === "career" ? stage.step : -1} />
        <Work />
        <Toolkit />
        <Contact />
      </main>
    </>
  );
}
