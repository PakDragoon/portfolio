import { useEffect, useRef, useState } from "react";

/**
 * Scroll progress drawn as an engine evaluation bar.
 * White's advantage grows as you read, and turns into mate at the end.
 */
export default function EvalBar() {
  const fill = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("+0.3");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (fill.current) fill.current.style.setProperty("--p", String(p));
      setLabel(p > 0.985 ? "M1" : `+${(0.3 + p * 5.6).toFixed(1)}`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="eval" aria-hidden="true">
      <div className="eval__track">
        <div ref={fill} className="eval__white" />
      </div>
      <span className="eval__num">{label}</span>
    </div>
  );
}
