import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Audience, Depth, Text } from "../data/content";

/* Two site-wide settings, framed as model controls:
 * audience = the "system prompt" (hiring manager or client)
 * depth    = the "temperature" (concise 0.2 or detailed 0.8) */

type Prefs = {
  audience: Audience;
  setAudience: (a: Audience) => void;
  depth: Depth;
  setDepth: (d: Depth) => void;
  t: (x: Text) => string;
};

const Ctx = createContext<Prefs | null>(null);

function read<T extends string>(key: string, fallback: T, allowed: T[]): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* storage blocked; the setting still applies for this visit */
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  // ?for=client links straight into client mode (handy for proposals)
  const fromUrl = new URLSearchParams(location.search).get("for");
  const [audience, setA] = useState<Audience>(
    fromUrl === "client" || fromUrl === "hiring" ? fromUrl : read<Audience>("ha-audience", "hiring", ["hiring", "client"])
  );
  const [depth, setD] = useState<Depth>(read<Depth>("ha-depth", "concise", ["concise", "detailed"]));

  useEffect(() => {
    document.documentElement.dataset.audience = audience;
    document.documentElement.dataset.depth = depth;
  }, [audience, depth]);

  const value = useMemo<Prefs>(
    () => ({
      audience,
      setAudience: (a) => {
        setA(a);
        write("ha-audience", a);
      },
      depth,
      setDepth: (d) => {
        setD(d);
        write("ha-depth", d);
      },
      t: (x) => (depth === "detailed" ? x.long : x.short),
    }),
    [audience, depth]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs outside PrefsProvider");
  return v;
}
