import { useEffect, useState } from "react";
import Tokens from "./Tokens";
import { PROFILE } from "../data/content";
import { usePrefs } from "../lib/prefs";

/* Contact as a prompt you fill in. Sending opens your email app with it ready to go. */

const WHO = { hiring: ["a hiring manager", "a recruiter", "an engineering lead"], client: ["a founder", "a product owner", "an agency"] };
const NEED = {
  hiring: ["a senior full-stack engineer", "a tech lead for a small team", "an engineer to own our AWS setup"],
  client: ["a SaaS product built", "an AI feature in my product", "help with AWS or a migration", "a technical lead for my team"],
};
const WHEN = ["as soon as possible", "in the next month", "later this year", "just exploring"];
const fit = (v: string) => ({ width: `${Math.max(4, v.length * 0.55 + 1.4)}em` });

export default function Contact() {
  const { audience } = usePrefs();
  const [who, setWho] = useState(WHO[audience][0]);
  const [org, setOrg] = useState("");
  const [need, setNeed] = useState(NEED[audience][0]);
  const [when, setWhen] = useState(WHEN[1]);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setWho(WHO[audience][0]);
    setNeed(NEED[audience][0]);
  }, [audience]);

  const prompt = `Hi Hassan, I'm ${who}${org ? ` at ${org}` : ""}. I'm looking for ${need}, ${when}.${notes ? `\n\n${notes}` : ""}`;
  const mail = `mailto:${PROFILE.email}?subject=${encodeURIComponent(audience === "client" ? "Project enquiry" : "Role at " + (org || "our team"))}&body=${encodeURIComponent(prompt)}`;

  const copy = () => {
    navigator.clipboard?.writeText(PROFILE.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  };

  return (
    <section id="contact" className="sec sec--ink contact">
      <div className="wrap">
        <Tokens text="Write me a prompt" />
        <p className="sec__sub">Fill in the blanks and send it. It opens your email app with everything ready.</p>

        <div className="prompt">
          <div className="prompt__head"><span>user</span><span>{prompt.length} chars</span></div>
          <p className="prompt__line">
            Hi Hassan, I'm{" "}
            <select aria-label="I am" style={fit(who)} value={who} onChange={(e) => setWho(e.target.value)}>
              {WHO[audience].map((w) => <option key={w}>{w}</option>)}
            </select>{" "}
            at{" "}
            <input aria-label="Company" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="your company" size={Math.max(12, org.length + 1)} />
            . I'm looking for{" "}
            <select aria-label="Looking for" style={fit(need)} value={need} onChange={(e) => setNeed(e.target.value)}>
              {NEED[audience].map((w) => <option key={w}>{w}</option>)}
            </select>
            ,{" "}
            <select aria-label="Timeline" style={fit(when)} value={when} onChange={(e) => setWhen(e.target.value)}>
              {WHEN.map((w) => <option key={w}>{w}</option>)}
            </select>
            .
          </p>
          <label className="sr" htmlFor="notes">Anything else</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else? Links, context, budget or team size." rows={3} />
          <div className="prompt__go">
            <a className="btn btn--hot" href={mail}>Send prompt</a>
            <span>Opens your email app, addressed to {PROFILE.email}</span>
          </div>
        </div>

        <ul className="direct">
          <li><span>Email</span><button onClick={copy}>{copied ? "Copied" : PROFILE.email}</button></li>
          <li><span>LinkedIn</span><a href={PROFILE.linkedin} target="_blank" rel="noopener">in/pakdragoon</a></li>
          <li><span>GitHub</span><a href={PROFILE.github} target="_blank" rel="noopener">PakDragoon</a></li>
          <li><span>WhatsApp</span><a href={PROFILE.whatsapp} target="_blank" rel="noopener">{PROFILE.phoneDisplay}</a></li>
          <li><span>Résumé</span><a href={PROFILE.resume} target="_blank" rel="noopener">PDF, 2 pages</a></li>
        </ul>
      </div>
    </section>
  );
}
