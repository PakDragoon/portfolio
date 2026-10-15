# Hassan Ali, portfolio

Personal portfolio with a chess thread running through it: a 3D knight touring a floating board in the hero (click a dotted square to move it), an engine evaluation bar as the scroll indicator, an annotated case study, and a mate-in-one puzzle.

Built with Vite, React 18, TypeScript and three.js.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to build/
```

## Where to edit content

| What | File |
| --- | --- |
| Name, email, phone, links | `src/data/content.ts` (`PROFILE`) |
| Hero headline and intro | `src/components/Hero.tsx` |
| Story chapters | `src/data/content.ts` (`CHAPTERS`, `OFF_THE_BOARD`) |
| Relay case study and projects | `src/data/content.ts` (`FEATURED`, `PROJECTS`) |
| Working principles and skills | `src/data/content.ts` (`PRINCIPLES`, `REPERTOIRE`) |
| Puzzle position | `src/components/Puzzle.tsx` |
| Résumé PDF | `public/Hassan-Ali-Resume.pdf` |
| 3D knight and board | `src/three/KnightScene.ts` |

The 3D scene loads after the text and only renders while the hero is on screen. The page works without WebGL, and reduced-motion users get no auto-rotation. Piece sounds are off by default.
