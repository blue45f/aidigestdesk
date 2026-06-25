// 배경음악 — Web Audio 로 절차 생성하는 신나는 대중 팝/시티팝(에셋 0·저작권 0). 웹·토스 공용.
// 킥·하이햇 비트 + 베이스 + 아르페지오 + 패드를 룩어헤드 스케줄러로 타이트하게 연주.
// 대중적 코드 진행(I-V-vi-IV 등) 4트랙 로테이션. 자동재생 안 함(토글=유저 제스처로 시작).
import { getAudioContext } from './sound';

interface Track {
  name: string;
  bpm: number;
  // 각 코드 = 화음 음 배열(Hz, 중음역). 첫 음을 루트로 간주(베이스는 한 옥타브 아래).
  chords: number[][];
}

// 대중적인 진행들. C=261.63 D=293.66 E=329.63 F=349.23 G=392 A=440 B=493.88 (4옥타브)
const C = 261.63;
const D = 293.66;
const E = 329.63;
const F = 349.23;
const G = 392.0;
const A = 440.0;
const B = 493.88;

const TRACKS: Track[] = [
  // I-V-vi-IV — 가장 대중적인 "팝 황금진행"
  { name: '시티팝', bpm: 110, chords: [[C, E, G], [G, B, D * 2], [A, C * 2, E * 2], [F, A, C * 2]] },
  // vi-IV-I-V — 신나는 변형
  { name: '드라이브', bpm: 118, chords: [[A, C * 2, E * 2], [F, A, C * 2], [C, E, G], [G, B, D * 2]] },
  // I-vi-IV-V — 50s 두왑/시티팝
  { name: '네온', bpm: 104, chords: [[C, E, G], [A, C * 2, E * 2], [F, A, C * 2], [G, B, D * 2]] },
  // ii-V-I-vi — 재지한 시티팝
  { name: '미드나잇', bpm: 100, chords: [[D, F, A], [G, B, D * 2], [C, E, G], [A, C * 2, E * 2]] },
];
const STEPS_PER_BAR = 8; // 8분음표 8칸
const BARS_PER_TRACK = 8; // 트랙당 8마디 후 다음 트랙

let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let schedulerTimer: number | null = null;
let playing = false;
let visibilityBound = false;
let stepCounter = 0; // 시작 이후 누적 스텝
let nextStepTime = 0; // 다음 스텝의 ctx 시간

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i += 1) ch[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

function osc(ctx: AudioContext, type: OscillatorType, freq: number, t: number, dur: number, peak: number, freqEnd?: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function kick(ctx: AudioContext, t: number) {
  osc(ctx, 'sine', 150, t, 0.18, 0.55, 52);
}

function hat(ctx: AudioContext, t: number, peak: number) {
  const src = ctx.createBufferSource();
  src.buffer = getNoise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  src.connect(hp).connect(g).connect(master!);
  src.start(t);
  src.stop(t + 0.06);
}

function currentTrack(): Track {
  const bar = Math.floor(stepCounter / STEPS_PER_BAR);
  return TRACKS[Math.floor(bar / BARS_PER_TRACK) % TRACKS.length] ?? (TRACKS[0] as Track);
}

function scheduleStep(step: number, t: number) {
  const ctx = getAudioContext();
  if (!ctx || !master) return;
  const track = currentTrack();
  const bar = Math.floor(step / STEPS_PER_BAR);
  const inBar = step % STEPS_PER_BAR;
  const chord = track.chords[bar % track.chords.length] ?? track.chords[0] ?? [C, E, G];
  const root = chord[0] ?? C;

  // 드럼 — 킥(박), 하이햇(엇박 강 / 박 약)
  if (inBar % 2 === 0) kick(ctx, t);
  hat(ctx, t, inBar % 2 === 1 ? 0.14 : 0.06);

  // 베이스 — 박마다 루트(한 옥타브 아래), 통통 튀게
  if (inBar % 2 === 0) osc(ctx, 'triangle', root / 2, t, 0.26, 0.34, root / 2.02);

  // 아르페지오 — 매 스텝 화음 음을 한 옥타브 위로 또렷한 플럭
  const arpNote = chord[inBar % chord.length] ?? root;
  osc(ctx, 'triangle', arpNote * 2, t, 0.22, 0.12);

  // 패드 — 마디 시작에 화음 길게(두께)
  if (inBar === 0) {
    chord.forEach((f, i) => osc(ctx, 'sine', f, t, (STEPS_PER_BAR * 60) / track.bpm / 2 + 0.4, 0.08 / (i + 1)));
  }
  stepCounter = step + 1;
}

function runScheduler() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const track = currentTrack();
  const stepDur = 60 / track.bpm / 2; // 8분음표
  // 룩어헤드: 0.2초 앞까지 미리 스케줄(타이밍 타이트)
  while (nextStepTime < ctx.currentTime + 0.2) {
    scheduleStep(stepCounter, nextStepTime);
    nextStepTime += stepDur;
  }
}

function resumeScheduling(fadeSeconds: number) {
  const ctx = getAudioContext();
  if (!ctx) return;
  master ??= ctx.createGain();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.42, ctx.currentTime + fadeSeconds);
  master.connect(ctx.destination);
  nextStepTime = ctx.currentTime + 0.1;
  runScheduler();
  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = (globalThis.setInterval as Window['setInterval'])(runScheduler, 50);
}

function pauseScheduling(fadeSeconds: number) {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  const ctx = getAudioContext();
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeSeconds);
  }
}

export function startBgm(): void {
  if (playing) return;
  if (!getAudioContext()) return;
  playing = true;
  resumeScheduling(1.0);
  if (!visibilityBound && typeof document !== 'undefined') {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!playing) return;
      if (document.hidden) pauseScheduling(0.4);
      else resumeScheduling(0.6);
    });
  }
}

export function stopBgm(): void {
  playing = false;
  pauseScheduling(0.5);
}

export function isBgmPlaying(): boolean {
  return playing;
}

/** 현재 트랙 이름(UI 표시용). */
export function currentTrackName(): string {
  return playing ? currentTrack().name : '';
}
