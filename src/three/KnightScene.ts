import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/*
 * A sculpted knight on a floating wooden board.
 * It plays a knight's tour on its own; visitors can click any square
 * a knight could reach to move it themselves.
 */

type Sq = { f: number; r: number };
const KNIGHT_JUMPS: [number, number][] = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];
const onBoard = (f: number, r: number) => f >= 0 && f < 8 && r >= 0 && r < 8;
const idx = (s: Sq) => s.r * 8 + s.f;
const world = (s: Sq, y = 0) => new THREE.Vector3(s.f - 3.5, y, 3.5 - s.r);

function jumpsFrom(s: Sq): Sq[] {
  return KNIGHT_JUMPS.map(([df, dr]) => ({ f: s.f + df, r: s.r + dr })).filter((t) => onBoard(t.f, t.r));
}

/** Warnsdorff's rule: always jump to the square with the fewest onward jumps. */
function knightsTour(start: Sq): Sq[] {
  const seen = new Set<number>([idx(start)]);
  const path = [start];
  let cur = start;
  for (let i = 1; i < 64; i++) {
    const options = jumpsFrom(cur).filter((t) => !seen.has(idx(t)));
    if (!options.length) break;
    options.sort(
      (a, b) =>
        jumpsFrom(a).filter((t) => !seen.has(idx(t))).length - jumpsFrom(b).filter((t) => !seen.has(idx(t))).length
    );
    cur = options[0];
    seen.add(idx(cur));
    path.push(cur);
  }
  return path;
}

const PALETTE = {
  boxwood: new THREE.Color(0xd9bd8c),
  walnut: new THREE.Color(0x5e3e28),
  ebony: 0x14110e,
  trail: 0xe6cf63,
  highlight: 0xd9c45a,
};

function buildKnight(mat: THREE.Material): THREE.Group {
  const g = new THREE.Group();

  // turned base, like a Staunton piece
  const base = new THREE.LatheGeometry(
    [
      [0, 0], [0.42, 0], [0.44, 0.03], [0.44, 0.08], [0.4, 0.11], [0.36, 0.13], [0.37, 0.17],
      [0.33, 0.2], [0.27, 0.22], [0.25, 0.27], [0, 0.27],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    64
  );
  const baseMesh = new THREE.Mesh(base, mat);
  baseMesh.castShadow = true;
  g.add(baseMesh);

  // head: a smooth silhouette, extruded with a deep bevel so it reads as carved
  const s = new THREE.Shape();
  s.moveTo(-0.22, 0);
  s.lineTo(0.26, 0);
  s.bezierCurveTo(0.34, 0.18, 0.36, 0.42, 0.3, 0.62); // back of the neck
  s.bezierCurveTo(0.25, 0.8, 0.16, 0.92, 0.06, 0.98); // mane
  s.lineTo(0.08, 1.08); // ear
  s.lineTo(-0.02, 1.0);
  s.bezierCurveTo(-0.14, 0.97, -0.26, 0.86, -0.36, 0.72); // forehead to nose
  s.bezierCurveTo(-0.42, 0.64, -0.42, 0.56, -0.36, 0.54); // muzzle
  s.bezierCurveTo(-0.3, 0.52, -0.22, 0.56, -0.14, 0.55); // jaw
  s.bezierCurveTo(-0.06, 0.54, -0.04, 0.46, -0.1, 0.38); // throat
  s.bezierCurveTo(-0.2, 0.26, -0.26, 0.12, -0.22, 0); // chest
  const head = new THREE.ExtrudeGeometry(s, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 10,
    curveSegments: 48,
  });
  head.translate(0, 0, -0.1);
  const headMesh = new THREE.Mesh(head, mat);
  headMesh.position.y = 0.24;
  headMesh.castShadow = true;
  g.add(headMesh);

  g.scale.setScalar(1.55);
  return g;
}

type Jump = { from: THREE.Vector3; to: THREE.Vector3; start: number; dur: number; yawFrom: number; yawTo: number };

export class KnightScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  private controls: OrbitControls;
  private tiles!: THREE.InstancedMesh;
  private tileLift = new Float32Array(64);
  private dots!: THREE.InstancedMesh;
  private hl: THREE.Mesh[] = [];
  private knight: THREE.Group;
  private trail = new THREE.Group();
  private trailPts: THREE.Vector3[][] = [];
  private tour: Sq[];
  private tourStep = 0;
  private pos: Sq;
  private jump: Jump | null = null;
  private nextAuto = 0;
  private userUntil = 0;
  private hover = -1;
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private downAt = new THREE.Vector2();
  private running = false;
  private raf = 0;
  private t0 = performance.now();
  private dummy = new THREE.Object3D();
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Called whenever the knight lands (for sound). */
  onMove?: () => void;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    const small = window.innerWidth < 700;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.82;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xfff0dc, 1.6);
    key.position.set(-4, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
    const sc = key.shadow.camera as THREE.OrthographicCamera;
    sc.left = sc.bottom = -6;
    sc.right = sc.top = 6;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 6;
    this.scene.add(key, new THREE.AmbientLight(0xffffff, 0.15));

    this.buildBoard();

    const ebony = new THREE.MeshPhysicalMaterial({
      color: PALETTE.ebony,
      roughness: 0.28,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.4,
      sheenColor: new THREE.Color(0x5a4636),
    });
    this.knight = buildKnight(ebony);
    this.scene.add(this.knight, this.trail);

    this.tour = knightsTour({ f: 6, r: 0 }); // starts on g1, the knight's home square
    this.pos = this.tour[0];
    this.knight.position.copy(world(this.pos, this.tileTop()));
    this.knight.rotation.y = -Math.PI / 2; // facing up the board
    this.setHighlight(null, this.pos);

    this.camera.position.set(6.4, 8.2, 9.4);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0.2, 0);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.rotateSpeed = 0.5;
    this.controls.minPolarAngle = 0.45;
    this.controls.maxPolarAngle = 1.12;
    this.controls.autoRotate = !this.reduced;
    this.controls.autoRotateSpeed = 0.35;
    this.controls.update();

    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointerleave", this.onLeave);
    this.resize();
  }

  private tileTop() {
    return 0.11;
  }

  private buildBoard() {
    const geo = new RoundedBoxGeometry(0.94, 0.22, 0.94, 4, 0.06);
    const mat = new THREE.MeshPhysicalMaterial({ roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.4, envMapIntensity: 0.55 });
    this.tiles = new THREE.InstancedMesh(geo, mat, 64);
    this.tiles.receiveShadow = true;
    this.tiles.castShadow = true;
    for (let r = 0; r < 8; r++)
      for (let f = 0; f < 8; f++) {
        this.tiles.setColorAt(r * 8 + f, (f + r) % 2 === 0 ? PALETTE.walnut : PALETTE.boxwood);
      }
    this.scene.add(this.tiles);

    // soft pool of shadow under the floating board, so it sits in the page
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const pool = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = -0.9;
    this.scene.add(pool);

    // legal-move dots, as on an analysis board
    const dotGeo = new THREE.CircleGeometry(0.15, 32);
    dotGeo.rotateX(-Math.PI / 2);
    this.dots = new THREE.InstancedMesh(
      dotGeo,
      new THREE.MeshBasicMaterial({ color: 0x1a1410, transparent: true, opacity: 0.38, depthWrite: false }),
      8
    );
    this.dots.count = 0;
    this.scene.add(this.dots);

    for (let i = 0; i < 2; i++) {
      const h = new THREE.Mesh(
        new THREE.PlaneGeometry(0.94, 0.94),
        new THREE.MeshBasicMaterial({ color: PALETTE.highlight, transparent: true, opacity: 0, depthWrite: false })
      );
      h.rotation.x = -Math.PI / 2;
      this.hl.push(h);
      this.scene.add(h);
    }
  }

  private setHighlight(from: Sq | null, to: Sq | null) {
    [from, to].forEach((s, i) => {
      const m = this.hl[i].material as THREE.MeshBasicMaterial;
      if (!s) {
        m.opacity = 0;
        return;
      }
      this.hl[i].userData.sq = idx(s);
      m.opacity = i === 0 ? 0.45 : 0.6;
    });
  }

  private legalTargets() {
    return this.jump ? [] : jumpsFrom(this.pos);
  }

  private startJump(to: Sq, now: number) {
    const from = this.pos;
    const a = world(from, this.tileTop());
    const b = world(to, this.tileTop());
    // the head is modelled facing -x; turn it toward the landing square
    const yawTo = Math.atan2(b.z - a.z, -(b.x - a.x));
    this.jump = { from: a, to: b, start: now, dur: this.reduced ? 1 : 560, yawFrom: this.knight.rotation.y, yawTo };
    this.setHighlight(from, to);
    this.addTrail(a, b);
    this.pos = to;
    this.dots.count = 0;
  }

  private addTrail(a: THREE.Vector3, b: THREE.Vector3) {
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 0.9;
    const curve = new THREE.QuadraticBezierCurve3(a.clone().setY(0.16), mid, b.clone().setY(0.16));
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, 0.022, 8),
      new THREE.MeshBasicMaterial({ color: PALETTE.trail, transparent: true, opacity: 0.9 })
    );
    this.trail.add(tube);
    this.trailPts.push([a, b]);
    // keep the last few jumps; older ones fade then go
    while (this.trail.children.length > 7) {
      const old = this.trail.children[0] as THREE.Mesh;
      old.geometry.dispose();
      (old.material as THREE.Material).dispose();
      this.trail.remove(old);
    }
    this.trail.children.forEach((c, i, arr) => {
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.75 * ((i + 1) / arr.length);
    });
  }

  private pick(e: PointerEvent): number {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObject(this.tiles)[0];
    return hit?.instanceId ?? -1;
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const i = this.pick(e);
    this.hover = i;
    const legal = this.legalTargets().some((s) => idx(s) === i);
    this.canvas.style.cursor = legal ? "pointer" : "grab";
    if (i >= 0) this.showDots();
  };

  private onLeave = () => {
    this.hover = -1;
  };

  private onPointerDown = (e: PointerEvent) => {
    this.downAt.set(e.clientX, e.clientY);
    this.controls.autoRotate = false;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.downAt.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 6) return; // that was a drag
    const i = this.pick(e);
    const target = this.legalTargets().find((s) => idx(s) === i);
    const now = performance.now();
    this.userUntil = now + 9000; // pause the tour while someone is playing
    if (target) this.startJump(target, now);
    else this.showDots();
  };

  private showDots() {
    const targets = this.legalTargets();
    this.dots.count = targets.length;
    targets.forEach((s, k) => {
      this.dummy.position.copy(world(s, this.tileTop() + this.tileLift[idx(s)] + 0.005));
      this.dummy.updateMatrix();
      this.dots.setMatrixAt(k, this.dummy.matrix);
    });
    this.dots.instanceMatrix.needsUpdate = true;
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const far = Math.max(1, (w < 700 ? 1.08 : 0.95) / this.camera.aspect);
    this.camera.position.setLength(23 * far);
    this.camera.updateProjectionMatrix();
  }

  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    if (on) this.raf = requestAnimationFrame(this.frame);
    else cancelAnimationFrame(this.raf);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    if (document.hidden) return;
    const t = (now - this.t0) / 1000;

    // the tour plays itself unless someone is moving the knight
    if (!this.jump && now > this.userUntil && now > this.nextAuto) {
      this.tourStep = (this.tourStep + 1) % this.tour.length;
      let next = this.tour[this.tourStep];
      if (!jumpsFrom(this.pos).some((s) => idx(s) === idx(next))) {
        // after a visitor moved it, rejoin the tour at the nearest reachable square
        const reach = jumpsFrom(this.pos);
        next = reach[Math.floor(Math.random() * reach.length)];
        this.tourStep = this.tour.findIndex((s) => idx(s) === idx(next));
      }
      this.startJump(next, now);
      if (now > this.userUntil && !this.reduced) this.controls.autoRotate = true;
    }

    // tiles float gently; hovered legal squares rise to meet the cursor
    const legal = new Set(this.legalTargets().map(idx));
    for (let i = 0; i < 64; i++) {
      const f = i % 8;
      const r = Math.floor(i / 8);
      const want = i === this.hover && legal.has(i) ? 0.16 : 0;
      this.tileLift[i] += (want - this.tileLift[i]) * 0.18;
      const wave = this.reduced ? 0 : Math.sin(t * 0.9 + (f + r) * 0.55) * 0.035;
      this.dummy.position.set(f - 3.5, wave + this.tileLift[i], 3.5 - r);
      this.dummy.updateMatrix();
      this.tiles.setMatrixAt(i, this.dummy.matrix);
    }
    this.tiles.instanceMatrix.needsUpdate = true;
    this.hl.forEach((h) => {
      const i = h.userData.sq ?? 0;
      const f = i % 8;
      const r = Math.floor(i / 8);
      const wave = this.reduced ? 0 : Math.sin(t * 0.9 + (f + r) * 0.55) * 0.035;
      h.position.set(f - 3.5, this.tileTop() + wave + this.tileLift[i] + 0.004, 3.5 - r);
    });
    if (this.hover >= 0) this.showDots();

    // knight jump: an arc with a small lean into the direction of travel
    const pf = this.pos.f;
    const pr = this.pos.r;
    const landWave = this.reduced ? 0 : Math.sin(t * 0.9 + (pf + pr) * 0.55) * 0.035;
    if (this.jump) {
      const j = this.jump;
      const k = Math.min(1, (now - j.start) / j.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      this.knight.position.lerpVectors(j.from, j.to, e);
      this.knight.position.y += Math.sin(Math.PI * e) * 1.1 + landWave;
      let dy = j.yawTo - j.yawFrom;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      this.knight.rotation.y = j.yawFrom + dy * Math.min(1, e * 1.6);
      this.knight.rotation.z = Math.sin(Math.PI * e) * 0.18;
      if (k >= 1) {
        this.jump = null;
        this.knight.rotation.z = 0;
        this.nextAuto = now + 1100;
        this.onMove?.();
      }
    } else {
      this.knight.position.y = this.tileTop() + landWave + this.tileLift[idx(this.pos)];
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.setRunning(false);
    this.controls.dispose();
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    this.renderer.dispose();
  }
}
