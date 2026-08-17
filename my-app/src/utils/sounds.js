// Efectos de sonido generados con Web Audio API (sin archivos externos):
// mantiene el proyecto liviano y sin dependencias para GitHub Pages.
let audioCtx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  return audioCtx;
}

function playTone(freq, startTime, duration, ctx, gainPeak = 0.2) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playSuccessSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // arpegio ascendente alegre
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    playTone(freq, now + i * 0.09, 0.35, ctx);
  });
}

export function playRetrySound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // sonido suave y neutro, nunca "de error"
  playTone(392, now, 0.18, ctx, 0.12);
  playTone(349.23, now + 0.12, 0.22, ctx, 0.12);
}

export function playLevelUpSound() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    playTone(freq, now + i * 0.1, 0.4, ctx, 0.22);
  });
}

export function playTapSound() {
  const ctx = getContext();
  if (!ctx) return;
  playTone(600, ctx.currentTime, 0.08, ctx, 0.08);
}
