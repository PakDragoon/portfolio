/* A soft wooden "tock" for piece moves, synthesised so there's no audio file to load. Off by default. */

const KEY = "ha-sound";
let ctx: AudioContext | null = null;
let enabled = (() => {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
})();
const listeners = new Set<(on: boolean) => void>();

export function soundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage can be blocked; the toggle still works for this visit */
  }
  listeners.forEach((l) => l(on));
  if (on) tock(0.6);
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function tock(volume = 1) {
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;
    // short filtered noise burst for the wood, plus a low thump for the felt
    const len = Math.floor(ctx.sampleRate * 0.06);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1800;
    band.Q.value = 2.2;
    const g1 = ctx.createGain();
    g1.gain.value = 0.5 * volume;
    noise.connect(band).connect(g1).connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.35 * volume, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(g2).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    /* audio unavailable; stay silent */
  }
}
