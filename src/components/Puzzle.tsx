import { useState } from "react";
import { tock } from "../lib/sound";

/* White to play and mate in one: the classic back-rank mate (Re8#). */

type Piece = "K" | "R" | "P" | "k" | "r" | "p";
const START: Record<string, Piece> = {
  g1: "K", e1: "R", f2: "P", g2: "P", h2: "P",
  g8: "k", f7: "p", g7: "p", h7: "p", a2: "r",
};
// filled glyphs for both sides; colour comes from CSS
const GLYPH: Record<Piece, string> = { K: "♚", R: "♜", P: "♟", k: "♚", r: "♜", p: "♟" };
const NAME: Record<Piece, string> = {
  K: "white king", R: "white rook", P: "white pawn", k: "black king", r: "black rook", p: "black pawn",
};
const FILES = "abcdefgh";
const isWhite = (p?: Piece) => !!p && p === p.toUpperCase();

function targets(board: Record<string, Piece>, from: string): string[] {
  const p = board[from];
  const f = FILES.indexOf(from[0]);
  const r = Number(from[1]);
  const out: string[] = [];
  const at = (ff: number, rr: number) => (ff >= 0 && ff < 8 && rr >= 1 && rr <= 8 ? `${FILES[ff]}${rr}` : null);
  if (p === "R") {
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      for (let k = 1; k < 8; k++) {
        const s = at(f + df * k, r + dr * k);
        if (!s) break;
        if (board[s]) {
          if (!isWhite(board[s])) out.push(s);
          break;
        }
        out.push(s);
      }
    }
  } else if (p === "K") {
    for (let df = -1; df <= 1; df++)
      for (let dr = -1; dr <= 1; dr++) {
        const s = at(f + df, r + dr);
        if (s && (df || dr) && !isWhite(board[s])) out.push(s);
      }
  } else if (p === "P") {
    const one = at(f, r + 1);
    if (one && !board[one]) {
      out.push(one);
      const two = at(f, r + 2);
      if (r === 2 && two && !board[two]) out.push(two);
    }
  }
  return out;
}

export default function Puzzle() {
  const [board, setBoard] = useState(START);
  const [sel, setSel] = useState<string | null>(null);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [state, setState] = useState<"play" | "wrong" | "solved">("play");

  const legal = sel ? targets(board, sel) : [];

  const click = (sq: string) => {
    if (state !== "play") return;
    if (sel && legal.includes(sq)) {
      const next = { ...board, [sq]: board[sel] };
      delete next[sel];
      setBoard(next);
      setLast([sel, sq]);
      setSel(null);
      tock();
      if (sel === "e1" && sq === "e8") {
        setState("solved");
      } else {
        setState("wrong");
        setTimeout(() => {
          setBoard(START);
          setLast(null);
          setState("play");
        }, 1600);
      }
      return;
    }
    setSel(isWhite(board[sq]) ? sq : null);
  };

  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <section id="puzzle" className="puzzle" aria-labelledby="puzzle-title">
      <div className="wrap puzzle__wrap">
        <div className="puzzle__copy">
          <h2 id="puzzle-title" className="h2">One for the road</h2>
          <p className="lede">White to play and mate in one. Click a piece, then a square.</p>
          <p className={`puzzle__status puzzle__status--${state}`} role="status" aria-live="polite">
            {state === "play" && "Your move."}
            {state === "wrong" && "Not mate. Black still has a way out. Try again."}
            {state === "solved" && "Checkmate. Re8#, the back-rank mate. If you enjoy that kind of problem, we'll get along."}
          </p>
          {state === "solved" && (
            <a className="btn" href="#contact">Let's talk</a>
          )}
        </div>

        <div className="mini" role="grid" aria-label="Chess puzzle board">
          {ranks.map((r) => (
            <div key={r} role="row" className="mini__row">
              {FILES.split("").map((f, fi) => {
                const sq = `${f}${r}`;
                const p = board[sq];
                const dark = (fi + r) % 2 === 1;
                const cls = [
                  "mini__sq",
                  dark ? "mini__sq--dark" : "mini__sq--light",
                  sel === sq ? "is-sel" : "",
                  last && (last[0] === sq || last[1] === sq) ? "is-last" : "",
                  legal.includes(sq) ? (p ? "is-capture" : "is-target") : "",
                  state === "solved" && sq === "g8" ? "is-mated" : "",
                ].join(" ");
                return (
                  <button
                    key={sq}
                    role="gridcell"
                    className={cls}
                    onClick={() => click(sq)}
                    aria-label={`${sq}${p ? `, ${NAME[p]}` : ""}`}
                  >
                    {p && <span className={`pc ${isWhite(p) ? "pc--w" : "pc--b"}`}>{GLYPH[p]}</span>}
                    {fi === 0 && <span className="coord coord--r">{r}</span>}
                    {r === 1 && <span className="coord coord--f">{f}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
