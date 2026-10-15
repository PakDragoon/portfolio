import { useRef, useState } from "react";
import { FEATURED, PROJECTS, type Project } from "../data/content";

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

function Row({ p, onHover }: { p: Project; onHover: (img?: string) => void }) {
  const Name = p.url ? "a" : "span";
  return (
    <li
      className="row"
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(p.img)}
      onPointerLeave={() => onHover(undefined)}
    >
      {p.img && <img className="row__thumb" src={p.img} alt={`${p.name} screenshot`} loading="lazy" width="1200" height="585" />}
      <div className="row__head">
        <Name className="row__name" {...(p.url ? { href: p.url, target: "_blank", rel: "noopener" } : {})}>
          {p.name}
          {p.url && <span className="row__visit"> Visit site</span>}
        </Name>
        <span className="row__kind">{p.kind}</span>
      </div>
      <p className="row__text">{p.text}</p>
      <Tags items={p.tags} />
    </li>
  );
}

export default function Work() {
  const [preview, setPreview] = useState<string | undefined>();
  const box = useRef<HTMLDivElement>(null);

  // the hover preview follows the cursor on desktop
  const move = (e: React.PointerEvent) => {
    if (!box.current) return;
    box.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`;
  };

  return (
    <section id="work" className="work" onPointerMove={move} aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title" className="h2">Selected work</h2>

        <article className="featured">
          <p className="featured__kind">Current, at CodingCops</p>
          <h3 className="featured__name">{FEATURED.name}</h3>
          <p className="featured__sub">{FEATURED.kind}</p>
          <p className="featured__text">{FEATURED.text}</p>
          <Tags items={FEATURED.tags} />
        </article>

        <ul className="rows">
          {PROJECTS.map((p) => <Row key={p.name} p={p} onHover={setPreview} />)}
        </ul>
      </div>

      <div ref={box} className={`preview ${preview ? "preview--on" : ""}`} aria-hidden="true">
        {preview && <img src={preview} alt="" />}
      </div>
    </section>
  );
}
