import { Fragment, useEffect, useRef, useState } from "react";
import type { NeuralNet } from "../three/NeuralNet";
import { HEADLINE, HERO_CTA, HERO_LEDE, PROFILE, SYSTEM_PROMPT } from "../data/content";
import { usePrefs } from "../lib/prefs";
import { reducedMotion } from "../lib/hooks";

export default function Hero({ netRef }: { netRef: React.MutableRefObject<NeuralNet | null> }) {
  const { audience, setAudience } = usePrefs();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [n, setN] = useState(reducedMotion() ? HEADLINE.length : 0);

  // three.js loads after the text
  useEffect(() => {
    let net: NeuralNet | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let gone = false;
    import("../three/NeuralNet")
      .then(({ NeuralNet }) => {
        if (gone || !canvas.current) return;
        try {
          net = new NeuralNet(canvas.current);
        } catch {
          return;
        }
        netRef.current = net;
        ro = new ResizeObserver(() => net?.resize());
        ro.observe(canvas.current);
        io = new IntersectionObserver(([e]) => net?.setRunning(e.isIntersecting));
        io.observe(canvas.current);
        canvas.current.classList.add("is-ready");
      })
      .catch(() => {});
    return () => {
      gone = true;
      io?.disconnect();
      ro?.disconnect();
      net?.dispose();
      netRef.current = null;
    };
  }, [netRef]);

  // generate the headline token by token
  useEffect(() => {
    if (n >= HEADLINE.length) return;
    const id = setTimeout(() => setN(n + 1), n === 0 ? 450 : 110 + Math.random() * 130);
    return () => clearTimeout(id);
  }, [n]);

  const cta = HERO_CTA[audience];
  const switchTo = (a: typeof audience) => {
    if (a === audience) return;
    setAudience(a);
    netRef.current?.pulse();
  };

  return (
    <header id="top" className="hero">
      <canvas ref={canvas} className="hero__net" aria-hidden="true" />
      <div className="hero__inner">
        <p className="hero__kicker"><i aria-hidden="true" />{PROFILE.title}, {PROFILE.location.split(",")[0]}</p>
        <h1 className="hero__h1" aria-label={HEADLINE.map(([w]) => w).join("")}>
          {HEADLINE.slice(0, n).map(([w, p], i) => (
            <Fragment key={i}>
              {w.startsWith(" ") && " "}
              <span className={`gen ${w.trim() === "thinks" ? "gen--hot" : ""}`} data-p={`p = ${p.toFixed(2)}`} aria-hidden="true">
                {w.trim()}
              </span>
            </Fragment>
          ))}
          <span className="caret" aria-hidden="true" />
        </h1>

        <div className="sys">
          <div className="sys__head">
            <span>system prompt</span>
            <div className="sys__switch" role="radiogroup" aria-label="I am visiting as">
              <button role="radio" aria-checked={audience === "hiring"} onClick={() => switchTo("hiring")}>Hiring manager</button>
              <button role="radio" aria-checked={audience === "client"} onClick={() => switchTo("client")}>Client</button>
            </div>
          </div>
          <p className="sys__prompt" key={audience}>{SYSTEM_PROMPT[audience]}</p>
        </div>

        <p className="hero__lede" key={`l-${audience}`}>{HERO_LEDE[audience]}</p>
        <div className="hero__cta">
          <a className="btn" href={cta.primary[1]}>{cta.primary[0]}</a>
          <a className="btn btn--ghost" href={cta.secondary[1]} {...(cta.secondary[1].endsWith(".pdf") ? { target: "_blank", rel: "noopener" } : {})}>
            {cta.secondary[0]}
          </a>
        </div>
        <p className="hero__hint">Move your cursor over the network, or click it to run a forward pass.</p>
      </div>
    </header>
  );
}
