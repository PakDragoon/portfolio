import { useCallback, useEffect, useRef, useState } from "react";
import type { NeuralNet } from "./three/NeuralNet";
import { PrefsProvider } from "./lib/prefs";
import Nav from "./components/Nav";
import TrainingMeter from "./components/TrainingMeter";
import Hero from "./components/Hero";
import ModelCard from "./components/ModelCard";
import Evals from "./components/Evals";
import History from "./components/History";
import Attention from "./components/Attention";
import Work from "./components/Work";
import CaseDrawer from "./components/CaseDrawer";
import Services from "./components/Services";
import Ask from "./components/Ask";
import Contact from "./components/Contact";
import { PROFILE } from "./data/content";

export default function App() {
  const net = useRef<NeuralNet | null>(null);
  const [caseId, setCaseId] = useState<string | null>(() => {
    const h = location.hash.replace("#", "");
    return h.startsWith("case-") ? h.slice(5) : null;
  });

  // case studies get their own shareable URL (#case-relay)
  const open = useCallback((id: string) => {
    setCaseId(id);
    history.replaceState(null, "", `#case-${id}`);
  }, []);
  const close = useCallback(() => {
    setCaseId(null);
    history.replaceState(null, "", location.pathname + location.search);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (caseId) lenis?.stop();
    else lenis?.start();
  }, [caseId]);

  const [tokens, setTokens] = useState(0);
  useEffect(() => {
    // rough size of the page's own text, counted once after load (about 1.3 tokens per word)
    const id = setTimeout(() => setTokens(Math.round(document.body.innerText.split(/\s+/).length * 1.3)), 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <PrefsProvider>
      <a className="skip" href="#about">Skip to content</a>
      <Nav />
      <TrainingMeter onProgress={(p) => net.current?.setTrained(p * 1.6)} />
      <main>
        <Hero netRef={net} />
        <ModelCard />
        <Evals />
        <History />
        <Work onOpen={open} />
        <Attention onOpen={open} />
        <Services />
        <Ask />
        <Contact />
      </main>
      <footer className="foot">
        <div className="wrap foot__in">
          <span>© {new Date().getFullYear()} {PROFILE.name}. Built with React and three.js.</span>
          <span className="foot__tok">{tokens ? `~${tokens.toLocaleString()} tokens of context on this page` : ""}</span>
          <a href="#top">Back to the input</a>
        </div>
      </footer>
      <CaseDrawer id={caseId} onClose={close} />
    </PrefsProvider>
  );
}
