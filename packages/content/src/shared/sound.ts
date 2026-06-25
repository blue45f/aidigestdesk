// UI 효과음 — Web Audio 로 합성(에셋 0·저작권 0). 웹·토스 공용.
// 첫 사용자 제스처에서 AudioContext 생성/재개(autoplay 정책 OK). SSR/오디오 불가 환경은 no-op.
// playTick: 모든 클릭 요소용 짧은 틱. playPop: 타이틀 탭용 상승 아르페지오 스파클.
let audioCtx: AudioContext | null = null;

/** 공유 AudioContext(없으면 생성, suspended면 재개). 브라우저 외 환경은 null. */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx ??= new Ctx();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function blip(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  peak: number,
  type: OscillatorType = 'triangle',
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

/** 일반 클릭용 — 짧고 부드러운 틱(은은). */
export function playTick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  blip(ctx, 660, ctx.currentTime, 0.07, 0.05);
}

/** 타이틀 탭용 — 상승 아르페지오(C·E·G·C) 스파클. */
export function playPop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => blip(ctx, freq, now + i * 0.045, 0.22, 0.16));
}
