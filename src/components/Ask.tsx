import { useEffect, useRef, useState } from "react";
import Tokens from "./Tokens";
import { QAS, QA_FALLBACK, type QA } from "../data/content";
import { reducedMotion, useSeen } from "../lib/hooks";

/* "Ask about me": answers stream token by token from this site's own content.
 * It's local keyword retrieval, not a live model; nothing is sent anywhere. */

type Msg = { who: "you" | "me"; text: string; src?: string[]; done?: boolean };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);

function retrieve(q: string): QA | null {
  const words = norm(q);
  let best: QA | null = null;
  let score = 0;
  for (const qa of QAS) {
    const keys = norm(qa.keys + " " + qa.q);
    const s = words.filter((w) => keys.some((k) => k.startsWith(w) || w.startsWith(k))).length;
    if (s > score) {
      score = s;
      best = qa;
    }
  }
  return score > 0 ? best : null;
}

export default function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const [secRef, seen] = useSeen<HTMLDivElement>(0.4);
  const asked = new Set(msgs.filter((m) => m.who === "you").map((m) => m.text));

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const ask = (q: string) => {
    if (busy || !q.trim()) return;
    const hit = retrieve(q);
    const answer = hit ? hit.a : QA_FALLBACK;
    const words = answer.match(/\s*\S+/g) ?? [answer];
    setMsgs((m) => [...m, { who: "you", text: q }, { who: "me", text: "", src: hit?.src }]);
    setInput("");
    setBusy(true);
    let i = 0;
    const fast = reducedMotion();
    const tick = () => {
      i = fast ? words.length : i + 1;
      setMsgs((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: words.slice(0, i).join(""), done: i >= words.length };
        return copy;
      });
      if (i < words.length) setTimeout(tick, 28 + Math.random() * 40);
      else setBusy(false);
    };
    setTimeout(tick, fast ? 0 : 380);
  };

  // demo the first answer once, so the section never sits empty
  useEffect(() => {
    if (seen && msgs.length === 0) ask(QAS[0].q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  return (
    <section id="ask" className="sec sec--tint">
      <div className="wrap ask" ref={secRef}>
        <div className="ask__intro">
          <Tokens text="Ask about me" />
          <p className="sec__sub">Pick a question or type your own. Answers are retrieved from this site and streamed back, with sources.</p>
          <p className="ask__note">Runs entirely in your browser. No live model, nothing is sent.</p>
        </div>
        <div className="chat">
          <div className="chat__log" ref={log} aria-live="polite" data-lenis-prevent>
            {msgs.length === 0 && <p className="chat__empty">Ask anything a hiring manager or client would. Try a suggestion below.</p>}
            {msgs.map((m, i) => (
              <div key={i} className={`msg msg--${m.who}`}>
                <p>
                  {m.text}
                  {m.who === "me" && !m.done && <span className="caret caret--sm" aria-hidden="true" />}
                </p>
                {m.who === "me" && m.done && m.src && (
                  <p className="msg__src">retrieved from {m.src.map((s) => <span key={s}>{s}</span>)}</p>
                )}
              </div>
            ))}
          </div>
          <div className="chat__sugg">
            {QAS.filter((q) => !asked.has(q.q)).slice(0, 4).map((q) => (
              <button key={q.q} onClick={() => ask(q.q)} disabled={busy}>{q.q}</button>
            ))}
          </div>
          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <label htmlFor="ask-in" className="sr">Your question</label>
            <input id="ask-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Have you worked with AWS?" autoComplete="off" />
            <button type="submit" disabled={busy || !input.trim()}>Ask</button>
          </form>
        </div>
      </div>
    </section>
  );
}
