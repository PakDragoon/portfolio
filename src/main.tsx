import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/martian-mono";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Smooth, weighted scrolling (skipped for reduced motion and touch, which already feel native).
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer: fine)").matches) {
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  document.documentElement.classList.add("lenis-on");
  const raf = (t: number) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  // in-page links scroll through Lenis so they ease like everything else
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const el = id === "top" ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(id === "top" ? 0 : (el as HTMLElement), { offset: -64 });
  });
}
