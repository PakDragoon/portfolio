import { Fragment, createElement, useMemo } from "react";
import { useSeen, reducedMotion } from "../lib/hooks";

/**
 * A heading that is "generated" token by token when it scrolls into view.
 * The text is always in the DOM (for search engines and screen readers);
 * only the visual reveal is staggered.
 */
export default function Tokens({
  text,
  as = "h2",
  className = "",
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
}) {
  const [ref, seen] = useSeen<HTMLElement>(0.4);
  const parts = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const still = reducedMotion();
  return createElement(
    as,
    { ref, id, className: `tokens ${seen || still ? "is-on" : ""} ${className}`, "aria-label": text },
    parts.map((p, i) => (
      <Fragment key={i}>
        {i > 0 && " "}
        <span className="tk" aria-hidden="true" style={{ transitionDelay: `${i * 55}ms` }}>
          {p}
        </span>
      </Fragment>
    ))
  );
}
