# Hassan Ali, portfolio

Personal portfolio. The hero and career sections sit over a three.js chessboard: scrolling through the career plays the opening of the Italian Game, one move per step.

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
| Name, email, phone, links, résumé path | `src/data/content.ts` (`PROFILE`) |
| Career steps (one per chess move) | `src/data/content.ts` (`STEPS`) |
| Projects | `src/data/content.ts` (`FEATURED`, `PROJECTS`) |
| Skills | `src/data/content.ts` (`SKILLS`) |
| Résumé PDF | `public/Hassan-Ali-Resume.pdf` |
| The 3D board and the moves it plays | `src/three/ChessScene.ts` |

The board loads after the text, and the page still works without WebGL. Reduced-motion users get instant moves and no auto-rotation.
