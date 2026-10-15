import * as THREE from "three";

/** Board square -> world position. Files a..h run along x, ranks 1..8 along -z. */
function squareToWorld(sq: string): THREE.Vector3 {
  const f = sq.charCodeAt(0) - 97; // a = 0
  const r = Number(sq[1]) - 1;
  return new THREE.Vector3(f - 3.5, 0, 3.5 - r);
}

type Kind = "p" | "r" | "n" | "b" | "q" | "k";
type Mode = "hero" | "game";

/**
 * Plies of the Italian Game, quiet line:
 * 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O
 * Each ply is a list of [from, to] so castling can move king and rook together.
 */
const PLIES: [string, string][][] = [
  [["e2", "e4"]],
  [["e7", "e5"]],
  [["g1", "f3"]],
  [["b8", "c6"]],
  [["f1", "c4"]],
  [["f8", "c5"]],
  [["c2", "c3"]],
  [["g8", "f6"]],
  [["d2", "d3"]],
  [["d7", "d6"]],
  [["e1", "g1"], ["h1", "f1"]],
  [["e8", "g8"], ["h8", "f8"]],
];
export const MAX_PLY = PLIES.length;

const COLORS = {
  light: 0xe8e3c4,
  dark: 0x6f8f57,
  frame: 0x221d17,
  white: 0xeee6cb,
  black: 0x1f2a24,
  highlight: 0xd6a846,
};

// ---------- piece geometry (built once, shared) ----------

const BASE: [number, number][] = [
  [0, 0],
  [0.36, 0],
  [0.36, 0.06],
  [0.32, 0.09],
  [0.3, 0.12],
];

function lathe(points: [number, number][]) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    40
  );
}

function knightHead() {
  const s = new THREE.Shape();
  const pts: [number, number][] = [
    [-0.2, 0.18], [0.2, 0.18], [0.17, 0.42], [0.06, 0.56], [0.3, 0.64], [0.36, 0.76],
    [0.3, 0.82], [0.12, 0.9], [0.04, 1.0], [-0.04, 0.94], [-0.16, 0.86], [-0.24, 0.66], [-0.24, 0.42],
  ];
  s.moveTo(pts[0][0], pts[0][1]);
  pts.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.04,
    bevelSegments: 3,
  });
  g.translate(0, 0, -0.1);
  return g;
}

function buildPiece(kind: Kind, mat: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, y = 0, sy = 1) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    m.scale.y = sy;
    m.castShadow = true;
    g.add(m);
  };
  switch (kind) {
    case "p":
      add(lathe([...BASE, [0.18, 0.16], [0.12, 0.34], [0.1, 0.44], [0.17, 0.48], [0.1, 0.52], [0, 0.52]]));
      add(new THREE.SphereGeometry(0.14, 24, 16), 0.63);
      break;
    case "r":
      add(lathe([...BASE, [0.23, 0.18], [0.2, 0.6], [0.28, 0.66], [0.28, 0.86], [0.2, 0.86], [0.2, 0.8], [0, 0.8]]));
      break;
    case "n":
      add(lathe([...BASE, [0.26, 0.18], [0, 0.18]]));
      add(knightHead());
      break;
    case "b":
      add(lathe([...BASE, [0.17, 0.18], [0.11, 0.55], [0.19, 0.6], [0.1, 0.65], [0, 0.65]]));
      add(new THREE.SphereGeometry(0.14, 24, 16), 0.8, 1.4);
      add(new THREE.SphereGeometry(0.045, 12, 8), 1.02);
      break;
    case "q":
      add(lathe([...BASE, [0.2, 0.18], [0.12, 0.72], [0.23, 0.8], [0.14, 0.86], [0.21, 1.02], [0.25, 1.1], [0, 1.06]]));
      add(new THREE.SphereGeometry(0.07, 16, 12), 1.15);
      break;
    case "k":
      add(lathe([...BASE, [0.21, 0.18], [0.13, 0.76], [0.24, 0.84], [0.15, 0.9], [0.21, 1.06], [0, 1.12]]));
      add(new THREE.BoxGeometry(0.06, 0.26, 0.06), 1.25);
      add(new THREE.BoxGeometry(0.2, 0.06, 0.06), 1.28);
      break;
  }
  return g;
}

// ---------- scene ----------

type Tween = { piece: THREE.Group; from: THREE.Vector3; to: THREE.Vector3; lift: number };

export class ChessScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  private board = new Map<string, THREE.Group>(); // square -> piece
  private highlights: THREE.Mesh[] = [];
  private ply = 0;
  private targetPly = 0;
  private tweens: Tween[] | null = null;
  private tweenStart = 0;
  private tweenDir = 1;
  private mode: Mode = "hero";
  private orbit = 0.6;
  private camPos = new THREE.Vector3(9, 10, 11);
  private pointer = new THREE.Vector2();
  private running = false;
  private visible = true;
  private raf = 0;
  private last = performance.now();
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.buildLights();
    this.buildBoard();
    this.buildPieces();
    this.resize();
    this.camera.position.copy(this.camPos);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xfff4dc, 0x1c2a22, 1.1));
    const key = new THREE.DirectionalLight(0xfff1d6, 2.2);
    key.position.set(-5, 11, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    const c = key.shadow.camera as THREE.OrthographicCamera;
    c.left = c.bottom = -7;
    c.right = c.top = 7;
    key.shadow.bias = -0.0008;
    key.shadow.radius = 4;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd8c0, 0.7);
    rim.position.set(6, 4, -8);
    this.scene.add(rim);
  }

  private buildBoard() {
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(9, 0.34, 9),
      new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.7 })
    );
    frame.position.y = -0.18;
    frame.receiveShadow = true;
    this.scene.add(frame);

    const sq = new THREE.BoxGeometry(1, 0.04, 1);
    const light = new THREE.MeshStandardMaterial({ color: COLORS.light, roughness: 0.85 });
    const dark = new THREE.MeshStandardMaterial({ color: COLORS.dark, roughness: 0.85 });
    for (let f = 0; f < 8; f++) {
      for (let r = 0; r < 8; r++) {
        const m = new THREE.Mesh(sq, (f + r) % 2 === 0 ? dark : light);
        m.position.set(f - 3.5, -0.02, 3.5 - r);
        m.receiveShadow = true;
        this.scene.add(m);
      }
    }
    const hlMat = new THREE.MeshBasicMaterial({ color: COLORS.highlight, transparent: true, opacity: 0, depthWrite: false });
    for (let i = 0; i < 2; i++) {
      const h = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hlMat.clone());
      h.rotation.x = -Math.PI / 2;
      h.position.y = 0.003;
      this.highlights.push(h);
      this.scene.add(h);
    }
  }

  private buildPieces() {
    const white = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.4, metalness: 0.05 });
    const black = new THREE.MeshStandardMaterial({ color: COLORS.black, roughness: 0.3, metalness: 0.15 });
    const back: Kind[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
    const place = (kind: Kind, isWhite: boolean, sq: string) => {
      const p = buildPiece(kind, isWhite ? white : black);
      p.position.copy(squareToWorld(sq));
      if (kind === "n") p.rotation.y = isWhite ? Math.PI / 2 : -Math.PI / 2;
      this.board.set(sq, p);
      this.scene.add(p);
    };
    "abcdefgh".split("").forEach((file, i) => {
      place(back[i], true, `${file}1`);
      place("p", true, `${file}2`);
      place("p", false, `${file}7`);
      place(back[i], false, `${file}8`);
    });
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Shift the board right on wide screens so text has room on the left,
    // and up on narrow screens so it sits above the text panels.
    if (w >= 960) this.camera.setViewOffset(w, h, -w * 0.19, 0, w, h);
    else this.camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    this.camera.updateProjectionMatrix();
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  setPly(n: number) {
    this.targetPly = Math.max(0, Math.min(MAX_PLY, n));
  }

  /** Start or stop rendering (e.g. when the board is scrolled out of view). */
  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    if (on) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else cancelAnimationFrame(this.raf);
  }

  setVisible(v: boolean) {
    this.visible = v;
  }

  private startNextPly(now: number) {
    const forward = this.targetPly > this.ply;
    const idx = forward ? this.ply : this.ply - 1;
    const moves = PLIES[idx];
    this.tweenDir = forward ? 1 : -1;
    this.tweens = moves.map(([a, b]) => {
      const from = forward ? a : b;
      const to = forward ? b : a;
      const piece = this.board.get(from)!;
      this.board.delete(from);
      this.board.set(to, piece);
      const isKnight = piece.children.length === 2 && (piece.children[1] as THREE.Mesh).geometry instanceof THREE.ExtrudeGeometry;
      return { piece, from: piece.position.clone(), to: squareToWorld(to), lift: isKnight ? 0.9 : 0.35 };
    });
    this.tweenStart = now;
    this.setHighlight(forward ? idx : idx - 1);
  }

  private setHighlight(plyIndex: number) {
    const mats = this.highlights.map((h) => h.material as THREE.MeshBasicMaterial);
    if (plyIndex < 0) {
      mats.forEach((m) => (m.opacity = 0));
      return;
    }
    const [from, to] = PLIES[plyIndex][0];
    this.highlights[0].position.set(squareToWorld(from).x, 0.003, squareToWorld(from).z);
    this.highlights[1].position.set(squareToWorld(to).x, 0.003, squareToWorld(to).z);
    mats.forEach((m) => (m.opacity = 0.55));
  }

  private frame = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (!this.visible || document.hidden) return;

    // moves
    if (!this.tweens && this.ply !== this.targetPly) this.startNextPly(now);
    if (this.tweens) {
      const dur = this.reduced ? 1 : 620;
      const t = Math.min(1, (now - this.tweenStart) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      for (const tw of this.tweens) {
        tw.piece.position.lerpVectors(tw.from, tw.to, e);
        tw.piece.position.y = Math.sin(Math.PI * e) * tw.lift;
      }
      if (t >= 1) {
        this.tweens = null;
        this.ply += this.tweenDir;
      }
    }

    // camera
    if (this.mode === "hero" && !this.reduced) this.orbit += dt * 0.07;
    const target = new THREE.Vector3();
    // pull the camera back on narrow (portrait) screens so the whole board fits
    const fit = Math.max(1, 0.9 / this.camera.aspect);
    if (this.mode === "hero") {
      const r = 16.5 * fit;
      target.set(Math.sin(this.orbit) * r, 10.5 * fit, Math.cos(this.orbit) * r);
    } else {
      // behind white, slightly to the side, looking down the board
      target.set((3 + this.pointer.x * 0.8) * fit, (12.5 - this.pointer.y * 0.6) * fit, 12.8 * fit);
    }
    if (this.mode === "hero") {
      target.x += this.pointer.x * 0.6;
      target.y -= this.pointer.y * 0.4;
    }
    this.camPos.lerp(target, this.reduced ? 1 : 1 - Math.pow(0.02, dt));
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(0, 0, 0.4);

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.setRunning(false);
    window.removeEventListener("pointermove", this.onPointer);
    this.renderer.dispose();
  }
}
