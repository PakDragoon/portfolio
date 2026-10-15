import { useEffect, useRef, useState } from "react";
import type { KnightScene } from "../three/KnightScene";
import { PROFILE } from "../data/content";
import { tock } from "../lib/sound";

function KnightStage() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let scene: KnightScene | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let disposed = false;
    import("../three/KnightScene")
      .then(({ KnightScene }) => {
        if (disposed || !canvas.current) return;
        try {
          scene = new KnightScene(canvas.current);
        } catch {
          setState("failed");
          return;
        }
        scene.onMove = () => tock(0.8);
        ro = new ResizeObserver(() => scene?.resize());
        ro.observe(canvas.current);
        // only render while the hero is on screen
        io = new IntersectionObserver(([e]) => scene?.setRunning(e.isIntersecting));
        io.observe(canvas.current);
        setState("ready");
      })
      .catch(() => setState("failed"));
    return () => {
      disposed = true;
      io?.disconnect();
      ro?.disconnect();
      scene?.dispose();
    };
  }, []);

  if (state === "failed") return null;
  return (
    <figure className={`stage stage--${state}`}>
      <canvas ref={canvas} aria-label="A 3D knight touring a chessboard. Click a highlighted square to move it." />
      <figcaption>Drag to look around. Click a dotted square to move the knight.</figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__copy">
        <p className="hero__hello">Hi, I'm Hassan.</p>
        <h1 className="hero__title">
          I do my best work in the <em>middlegame</em>.
        </h1>
        <p className="hero__lede">
          The demo is the opening. The middle is where real users, real data and real deadlines show up,
          and that's the part of building software I enjoy most. For five years I've built web products end
          to end, and today I lead a team of five shipping a SaaS for car dealerships from Lahore.
        </p>
        <div className="hero__actions">
          <a className="btn" href="#games">See the work</a>
          <a className="btn btn--quiet" href="#contact">Get in touch</a>
          <a className="link" href={PROFILE.resume} target="_blank" rel="noopener">Résumé (PDF)</a>
        </div>
      </div>
      <KnightStage />
    </section>
  );
}
