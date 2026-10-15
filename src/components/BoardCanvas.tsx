import { useEffect, useRef, useState } from "react";
import type { ChessScene as Scene } from "../three/ChessScene";

type Props = { ply: number; mode: "hero" | "game"; shown: boolean };

/** Fixed full-screen WebGL layer behind the hero and career sections. */
export default function BoardCanvas({ ply, mode, shown }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scene = useRef<Scene | null>(null);
  const [failed, setFailed] = useState(false);
  const latest = useRef({ ply, mode, shown });
  latest.current = { ply, mode, shown };

  useEffect(() => {
    let disposed = false;
    let onResize: () => void = () => {};
    // three.js is loaded on demand so text renders first
    import("../three/ChessScene")
      .then(({ ChessScene }) => {
        if (disposed || !ref.current) return;
        try {
          const s = new ChessScene(ref.current);
          scene.current = s;
          s.setPly(latest.current.ply);
          s.setMode(latest.current.mode);
          s.setVisible(latest.current.shown);
          onResize = () => s.resize();
          window.addEventListener("resize", onResize);
          s.setRunning(true);
          requestAnimationFrame(() => ref.current?.classList.add("ready"));
        } catch {
          setFailed(true); // no WebGL: the page still reads fine without the board
        }
      })
      .catch(() => setFailed(true));
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  useEffect(() => scene.current?.setPly(ply), [ply]);
  useEffect(() => scene.current?.setMode(mode), [mode]);
  useEffect(() => scene.current?.setVisible(shown), [shown]);

  if (failed) return null;
  return <canvas ref={ref} className={`board ${shown ? "" : "board--hidden"}`} aria-hidden="true" />;
}
