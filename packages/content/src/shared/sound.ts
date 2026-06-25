// UI 효과음 — Web Audio 로 합성(에셋 0·저작권 0). 웹·토스 공용.
// 첫 사용자 제스처에서 AudioContext 생성/재개(autoplay 정책 OK). SSR/오디오 불가 환경은 no-op.
// playTick: 모든 클릭 요소용 짧은 틱. playPop: 타이틀 탭용 상승 아르페지오 스파클.
let audioCtx: AudioContext | null = null;

const MUTE_KEY = 'aid-sound-muted';
let muted: boolean | null = null; // lazy init from localStorage

/** 효과음 음소거 여부(기본 OFF=소리 켜짐). */
export function isSoundMuted(): boolean {
  if (muted === null) {
    if (typeof window === 'undefined') return false;
    try {
      muted = window.localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      muted = false;
    }
  }
  return muted;
}

/** 효과음 음소거 설정(localStorage 영속). */
export function setSoundMuted(value: boolean): void {
  muted = value;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    /* 저장 불가 무시 */
  }
}

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

interface ToneOpts {
  freq: number;
  freqEnd?: number; // 있으면 피치 글라이드(미끄러지는 "뽕" 느낌)
  start: number;
  dur: number;
  peak: number;
  type?: OscillatorType;
}

function tone(ctx: AudioContext, o: ToneOpts): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = o.type ?? 'triangle';
  osc.frequency.setValueAtTime(o.freq, o.start);
  if (o.freqEnd) osc.frequency.exponentialRampToValueAtTime(o.freqEnd, o.start + o.dur);
  gain.gain.setValueAtTime(0, o.start);
  gain.gain.linearRampToValueAtTime(o.peak, o.start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(o.start);
  osc.stop(o.start + o.dur + 0.02);
}

// 메이저 펜타토닉(C5 D5 E5 G5 A5) — 클릭마다 랜덤 음을 골라 연타가 작은 멜로디처럼 들리게.
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0];

/** 일반 클릭용 — 펜타토닉 랜덤 음 + 위로 미끄러지는 "뽕" 블립 + 반짝 하모닉. 음소거 시 no-op. */
export function playTick(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] ?? 659.25;
  tone(ctx, { freq: f * 0.62, freqEnd: f, start: now, dur: 0.1, peak: 0.06, type: 'triangle' });
  tone(ctx, { freq: f * 2, start: now + 0.005, dur: 0.05, peak: 0.022, type: 'sine' });
}

/** 타이틀 탭용 — 빠른 상승 런 + 반짝이는 고음 꼬리("마법/팡" 느낌). 음소거 시 no-op. */
export function playPop(): void {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // 상승 런(C·E·G·C·E 한 옥타브 위)
  [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, i) =>
    tone(ctx, { freq, start: now + i * 0.05, dur: 0.26, peak: 0.14, type: 'triangle' }),
  );
  // 베이스 "둥" 한 방으로 두께
  tone(ctx, { freq: 130.81, freqEnd: 196, start: now, dur: 0.18, peak: 0.1, type: 'sine' });
  // 반짝 꼬리 — 랜덤 고음 스파클
  for (let i = 0; i < 5; i += 1) {
    tone(ctx, {
      freq: 1500 + Math.random() * 1100,
      start: now + 0.26 + i * 0.04,
      dur: 0.16,
      peak: 0.045,
      type: 'sine',
    });
  }
}
