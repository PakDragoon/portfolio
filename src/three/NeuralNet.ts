import * as THREE from "three";

/*
 * The hero network: six layers of nodes with weighted connections.
 * - Pulses travel layer to layer (a forward pass that never stops).
 * - Nodes near the cursor activate and light their connections.
 * - A click fires a full forward pass from the input layer.
 * - setTrained(0..1) sharpens strong weights and fades weak ones (driven by scroll).
 */

type Node = { x: number; y: number; z: number; layer: number; act: number };

export class NeuralNet {
  private r: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  private group = new THREE.Group();
  private nodes: Node[] = [];
  private edges: [number, number, number][] = [];
  private nodeColors!: Float32Array;
  private edgeColors!: Float32Array;
  private pulsePos!: Float32Array;
  private pulses: { e: number; t: number; v: number }[] = [];
  private nodeGeo!: THREE.BufferGeometry;
  private edgeGeo!: THREE.BufferGeometry;
  private pulseGeo!: THREE.BufferGeometry;
  private outgoing: number[][] = [];
  private layerStart: number[] = [];
  private trained = 0;
  private mouse = new THREE.Vector2(9, 9);
  private running = false;
  private raf = 0;
  private wave = -1; // layer index of a click-triggered forward pass
  private waveT = 0;
  private reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private tmp = new THREE.Vector3();
  private c = {
    ink: new THREE.Color(0x14171c),
    faint: new THREE.Color(0xc9ccc6),
    paper: new THREE.Color(0xf3f4f1),
    hot: new THREE.Color(0xe4572e),
    warm: new THREE.Color(0xf2a541),
  };

  constructor(private canvas: HTMLCanvasElement) {
    this.r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.build();
    this.resize();
    window.addEventListener("pointermove", this.onMove, { passive: true });
    canvas.addEventListener("pointerdown", this.onClick);
  }

  private build() {
    const layers = [8, 13, 17, 17, 13, 6];
    const gap = 3.1;
    layers.forEach((n, li) => {
      this.layerStart.push(this.nodes.length);
      for (let k = 0; k < n; k++) {
        this.nodes.push({
          x: (li - (layers.length - 1) / 2) * gap,
          y: (k - (n - 1) / 2) * 0.72,
          z: (Math.random() - 0.5) * 1.8,
          layer: li,
          act: 0,
        });
      }
    });
    this.layerStart.push(this.nodes.length);
    for (let li = 0; li < layers.length - 1; li++) {
      for (let a = this.layerStart[li]; a < this.layerStart[li + 1]; a++)
        for (let b = this.layerStart[li + 1]; b < this.layerStart[li + 2]; b++)
          if (Math.random() < 0.5) this.edges.push([a, b, Math.random()]);
    }
    this.outgoing = this.nodes.map(() => []);
    this.edges.forEach(([a], i) => this.outgoing[a].push(i));

    // edges
    const ep = new Float32Array(this.edges.length * 6);
    this.edgeColors = new Float32Array(this.edges.length * 6);
    this.edges.forEach(([a, b], k) => {
      const A = this.nodes[a];
      const B = this.nodes[b];
      ep.set([A.x, A.y, A.z, B.x, B.y, B.z], k * 6);
    });
    this.edgeGeo = new THREE.BufferGeometry();
    this.edgeGeo.setAttribute("position", new THREE.BufferAttribute(ep, 3));
    this.edgeGeo.setAttribute("color", new THREE.BufferAttribute(this.edgeColors, 3));
    this.group.add(
      new THREE.LineSegments(this.edgeGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6 }))
    );

    // soft round sprite
    const dot = document.createElement("canvas");
    dot.width = dot.height = 64;
    const g = dot.getContext("2d")!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.45, "rgba(255,255,255,.92)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(dot);

    // nodes
    const np = new Float32Array(this.nodes.length * 3);
    this.nodeColors = new Float32Array(this.nodes.length * 3);
    this.nodes.forEach((n, k) => np.set([n.x, n.y, n.z], k * 3));
    this.nodeGeo = new THREE.BufferGeometry();
    this.nodeGeo.setAttribute("position", new THREE.BufferAttribute(np, 3));
    this.nodeGeo.setAttribute("color", new THREE.BufferAttribute(this.nodeColors, 3));
    this.group.add(
      new THREE.Points(
        this.nodeGeo,
        new THREE.PointsMaterial({ size: 0.44, vertexColors: true, map: sprite, transparent: true, depthWrite: false })
      )
    );

    // pulses
    const P = 110;
    this.pulsePos = new Float32Array(P * 3);
    for (let k = 0; k < P; k++) this.pulses.push({ e: Math.floor(Math.random() * this.edges.length), t: Math.random(), v: 0.5 + Math.random() });
    this.pulseGeo = new THREE.BufferGeometry();
    this.pulseGeo.setAttribute("position", new THREE.BufferAttribute(this.pulsePos, 3));
    this.group.add(
      new THREE.Points(
        this.pulseGeo,
        new THREE.PointsMaterial({ size: 0.3, color: 0xe4572e, map: sprite, transparent: true, depthWrite: false })
      )
    );

    this.group.rotation.y = -0.35;
    this.scene.add(this.group);
    this.cam.position.set(0, 0, 16);
  }

  private onMove = (e: PointerEvent) => {
    this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };

  private onClick = () => {
    this.wave = 0;
    this.waveT = 0;
  };

  /** Fire a forward pass (also used when the audience changes). */
  pulse() {
    this.onClick();
  }

  setTrained(p: number) {
    this.trained = Math.max(0, Math.min(1, p));
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.r.setSize(w, h, false);
    this.cam.aspect = w / h;
    this.cam.updateProjectionMatrix();
    const narrow = w < 820;
    this.group.position.set(narrow ? 0 : 3, narrow ? 2.6 : 0, 0);
    this.group.scale.setScalar(narrow ? 0.7 : 1);
  }

  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    if (on) this.raf = requestAnimationFrame(this.loop);
    else cancelAnimationFrame(this.raf);
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    if (document.hidden) return;
    const t = now / 1000;
    const { ink, faint, paper, hot, warm } = this.c;

    if (!this.reduce) {
      this.group.rotation.y = -0.35 + Math.sin(t * 0.15) * 0.12 + this.mouse.x * 0.14;
      this.group.rotation.x = this.mouse.y * -0.07;
    }
    this.group.updateMatrixWorld();

    // click-triggered forward pass: light one layer after another
    if (this.wave >= 0) {
      this.waveT += 0.016;
      const layer = Math.floor(this.waveT / 0.11);
      if (layer >= this.layerStart.length - 1) this.wave = -1;
      else for (let k = this.layerStart[layer]; k < this.layerStart[layer + 1]; k++) this.nodes[k].act = Math.max(this.nodes[k].act, 1);
    }

    this.nodes.forEach((n, k) => {
      this.tmp.set(n.x, n.y, n.z).applyMatrix4(this.group.matrixWorld).project(this.cam);
      const d = Math.hypot(this.tmp.x - this.mouse.x, this.tmp.y - this.mouse.y);
      n.act = Math.max(n.act * 0.94, Math.max(0, 1 - d * 3.4));
      const col = faint.clone().lerp(ink, 0.5 + this.trained * 0.4).lerp(hot, n.act);
      this.nodeColors.set([col.r, col.g, col.b], k * 3);
    });
    this.nodeGeo.attributes.color.needsUpdate = true;

    this.edges.forEach(([a, b, w], k) => {
      const strong = w > 0.62;
      const vis = strong ? 0.22 + this.trained * 0.7 : (1 - this.trained) * 0.32 + 0.05;
      const act = Math.max(this.nodes[a].act, this.nodes[b].act);
      const col = paper.clone().lerp(strong ? ink : faint, vis).lerp(warm, act * 0.85);
      this.edgeColors.set([col.r, col.g, col.b, col.r, col.g, col.b], k * 6);
    });
    this.edgeGeo.attributes.color.needsUpdate = true;

    this.pulses.forEach((p, k) => {
      p.t += (this.reduce ? 0 : 0.012) * p.v;
      if (p.t > 1) {
        const b = this.edges[p.e][1];
        const next = this.outgoing[b];
        this.nodes[b].act = Math.max(this.nodes[b].act, 0.5);
        p.e = next.length ? next[Math.floor(Math.random() * next.length)] : Math.floor(Math.random() * (this.edges.length / 4));
        p.t = 0;
      }
      const [a, b] = this.edges[p.e];
      const A = this.nodes[a];
      const B = this.nodes[b];
      this.pulsePos.set([A.x + (B.x - A.x) * p.t, A.y + (B.y - A.y) * p.t, A.z + (B.z - A.z) * p.t], k * 3);
    });
    this.pulseGeo.attributes.position.needsUpdate = true;

    this.r.render(this.scene, this.cam);
  };

  dispose() {
    this.setRunning(false);
    window.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerdown", this.onClick);
    this.r.dispose();
  }
}
