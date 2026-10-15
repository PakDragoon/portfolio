import { useEffect, useRef } from "react";
import { useActiveSection, useScrollProgress } from "../lib/hooks";
import { SECTIONS } from "./Nav";

/* Scroll progress drawn as a training run.
 * Wide screens: a vertical rail in the right margin; the loss curve falls as you read,
 * and each section is a checkpoint you can jump to.
 * Narrow screens: a compact pill at the bottom. */

const lossAt = (p: number) => 0.08 + 2.23 * Math.exp(-4.2 * p) + 0.04 * Math.sin(p * 40) * (1 - p);

export default function TrainingMeter({ onProgress }: { onProgress?: (p: number) => void }) {
  const p = useScrollProgress();
  const active = useActiveSection(SECTIONS.map(([id]) => id));
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    onProgress?.(p);
    const c = canvas.current;
    if (!c || !c.offsetParent) return;
    const x = c.getContext("2d")!;
    const w = c.width;
    const h = c.height;
    x.clearRect(0, 0, w, h);
    // vertical: y is training progress, x is loss (high loss to the right)
    const N = 160;
    const X = (q: number) => 10 + (lossAt(q) / 2.4) * (w - 20);
    x.setLineDash([4, 6]);
    x.strokeStyle = "rgba(20,23,28,.22)";
    x.lineWidth = 2;
    x.beginPath();
    for (let k = 0; k <= N; k++) k ? x.lineTo(X(k / N), (k / N) * h) : x.moveTo(X(0), 0);
    x.stroke();
    x.setLineDash([]);
    x.strokeStyle = "#e4572e";
    x.lineWidth = 3.5;
    x.beginPath();
    for (let k = 0; k <= N * p; k++) k ? x.lineTo(X(k / N), (k / N) * h) : x.moveTo(X(0), 0);
    x.stroke();
    x.fillStyle = "#e4572e";
    x.beginPath();
    x.arc(X(p), p * h, 6, 0, 7);
    x.fill();
  }, [p, onProgress]);

  const epoch = Math.max(1, Math.ceil(p * 12));
  const label = SECTIONS.find(([id]) => id === active)?.[1];
  return (
    <aside className="meter" aria-label="Page progress">
      <div className="meter__stat">
        <span>epoch</span>
        <b>{epoch}/12</b>
      </div>
      <div className="meter__rail">
        <canvas ref={canvas} width={112} height={560} aria-hidden="true" />
        <ol className="meter__ckpt">
          {SECTIONS.map(([id, name], i) => (
            <li key={id} style={{ ["--y" as string]: i / (SECTIONS.length - 1) }}>
              <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                <span className="meter__tip">{name}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className="meter__stat">
        <span>loss</span>
        <b>{lossAt(p).toFixed(2)}</b>
      </div>
      <p className="meter__now">{label}</p>
      <i className="meter__bar" style={{ ["--p" as string]: p }} aria-hidden="true" />
    </aside>
  );
}
