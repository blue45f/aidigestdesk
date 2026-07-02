// 배경음악 — 호스티드 mp3 플레이리스트(1순위) + Web Audio 절차 생성 시티팝(폴백). 웹·토스 공용.
// `/audio/playlist.json`을 첫 startBgm에서 1회 fetch(모듈 로드 사이드이펙트 0, 결과 세션 캐시).
// 매니페스트가 없거나(404/비JSON/스키마 불일치) autoplay 정책에 막히면 조용히 합성 엔진으로 폴백.
// 자동재생 안 함(토글=유저 제스처로 시작). stopBgm→startBgm은 위치 보존 resume — 광고 파이프라인
// (apps/toss lib/ads.ts: 광고 전 stopBgm / 종료 후 startBgm)이 이 계약에 의존한다.
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

// ---------- 호스티드 mp3 플레이리스트 레이어 ----------

/** 호스티드 트랙의 출처 표기 정보(UI 크레딧 표시용). */
export interface BgmTrackCredit {
  title: string;
  artist?: string;
  license?: string;
  creditUrl?: string;
}

interface HostedTrack extends BgmTrackCredit {
  /** 절대화된 오디오 URL(성공한 manifest 오리진 기준). */
  src: string;
}

// 토스 미니앱 번들은 웹 오리진이 아니라 상대 fetch가 실패할 수 있다 — 웹 프로덕션 오리진 폴백.
const REMOTE_MANIFEST_URL = 'https://aidigestdesk.vercel.app/audio/playlist.json';
const HOSTED_VOLUME = 0.5;
const FADE_MS = 800;

type BgmMode = 'synth' | 'hosted';
let mode: BgmMode = 'synth';
let hostedTracks: HostedTrack[] = [];
let hostedIndex = 0;
let manifestPromise: Promise<void> | null = null;
let manifestReady = false;
let audioEl: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

/** 매니페스트 JSON → 검증된 트랙 목록. src는 baseUrl 기준 절대화. (순수 함수 — 테스트 대상) */
export function parseBgmManifest(data: unknown, baseUrl: string): HostedTrack[] {
  if (typeof data !== 'object' || data === null) return [];
  const raw = (data as { tracks?: unknown }).tracks;
  if (!Array.isArray(raw)) return [];
  const out: HostedTrack[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const t = item as Record<string, unknown>;
    if (typeof t.src !== 'string' || t.src === '' || typeof t.title !== 'string' || t.title === '') continue;
    let src: string;
    try {
      src = new URL(t.src, baseUrl).toString();
    } catch {
      continue;
    }
    out.push({
      src,
      title: t.title,
      ...(typeof t.artist === 'string' ? { artist: t.artist } : {}),
      ...(typeof t.license === 'string' ? { license: t.license } : {}),
      ...(typeof t.creditUrl === 'string' ? { creditUrl: t.creditUrl } : {}),
    });
  }
  return out;
}

async function fetchManifest(url: string): Promise<HostedTrack[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    // SPA 폴백이 HTML을 200으로 돌려주는 경우 등 비JSON이면 json()이 throw → [].
    const data: unknown = await res.json();
    return parseBgmManifest(data, res.url || url);
  } catch {
    return [];
  }
}

/** 매니페스트 1회 fetch(세션 캐시). 실패해도 조용히 — 합성 폴백이 있으므로 콘솔 스팸 금지. */
function ensureManifest(): Promise<void> {
  manifestPromise ??= (async () => {
    if (typeof fetch === 'undefined') return;
    let tracks = await fetchManifest('/audio/playlist.json');
    if (tracks.length === 0) tracks = await fetchManifest(REMOTE_MANIFEST_URL);
    if (tracks.length > 0) {
      hostedTracks = tracks;
      manifestReady = true;
    }
  })();
  return manifestPromise;
}

function getAudioElement(): HTMLAudioElement | null {
  if (audioEl) return audioEl;
  if (typeof window === 'undefined' || typeof window.Audio === 'undefined') return null;
  try {
    const el = new window.Audio();
    el.preload = 'auto';
    el.addEventListener('ended', () => {
      // 트랙 로테이션 — 무한 순환.
      if (!playing || mode !== 'hosted' || hostedTracks.length === 0) return;
      hostedIndex = (hostedIndex + 1) % hostedTracks.length;
      playHosted(true);
    });
    audioEl = el;
    return el;
  } catch {
    return null;
  }
}

/** 볼륨 램프(페이드). 새 페이드가 시작되면 진행 중이던 페이드(및 그 완료 콜백)는 취소된다. */
function fadeAudioTo(el: HTMLAudioElement, target: number, ms: number, onDone?: () => void) {
  if (fadeTimer) clearInterval(fadeTimer);
  const from = el.volume;
  const startedAt = Date.now();
  fadeTimer = setInterval(() => {
    const p = Math.min(1, (Date.now() - startedAt) / ms);
    try {
      el.volume = from + (target - from) * p;
    } catch {
      /* iOS 등 볼륨 제어 불가 환경 무시 */
    }
    if (p >= 1) {
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = null;
      onDone?.();
    }
  }, 50);
}

function startSynth(fadeSeconds: number): void {
  mode = 'synth';
  resumeScheduling(fadeSeconds);
}

/**
 * 호스티드 재생 시작/재개. restart=true면 트랙 처음부터(로테이션), 아니면 현재 위치에서 resume
 * (stopBgm이 위치를 보존하므로 광고 후 startBgm이 같은 지점에서 이어진다).
 * play()가 reject(autoplay 정책)하면 합성 폴백 — 유저 제스처로 이미 ctx가 언락된 상태.
 */
function playHosted(restart = false): void {
  const el = getAudioElement();
  const track = hostedTracks[hostedIndex];
  if (!el || !track) {
    startSynth(1.0);
    return;
  }
  mode = 'hosted';
  try {
    if (el.src !== track.src) el.src = track.src;
    else if (restart) el.currentTime = 0;
    try {
      el.volume = 0;
    } catch {
      /* 볼륨 제어 불가 환경 무시 */
    }
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        fadeAudioTo(el, HOSTED_VOLUME, FADE_MS);
      }).catch(() => {
        if (playing) startSynth(1.0);
      });
    } else {
      fadeAudioTo(el, HOSTED_VOLUME, FADE_MS);
    }
  } catch {
    if (playing) startSynth(1.0);
  }
}

/** 페이드아웃 후 pause — currentTime(재생 위치)은 보존. */
function pauseHosted(ms: number): void {
  const el = audioEl;
  if (!el || el.paused) return;
  fadeAudioTo(el, 0, ms, () => {
    try {
      el.pause();
    } catch {
      /* 무시 */
    }
  });
}

function bindVisibility(): void {
  if (visibilityBound || typeof document === 'undefined') return;
  visibilityBound = true;
  document.addEventListener('visibilitychange', () => {
    if (!playing) return;
    if (document.hidden) {
      if (mode === 'hosted') pauseHosted(400);
      else pauseScheduling(0.4);
    } else if (mode === 'hosted') {
      playHosted();
    } else {
      resumeScheduling(0.6);
    }
  });
}

export function startBgm(): void {
  if (playing) return;
  if (typeof window === 'undefined') return;
  playing = true;
  try {
    bindVisibility();
    if (manifestReady && hostedTracks.length > 0) {
      playHosted(); // stop 시점 위치에서 그대로 resume
    } else {
      // 매니페스트 미도착/실패 — 무음 구간 없이 합성을 즉시 시작하고,
      // 매니페스트가 도착하면(여전히 재생 중일 때만) 합성 페이드아웃→호스티드 페이드인 전환.
      startSynth(1.0);
      void ensureManifest()
        .then(() => {
          if (playing && mode === 'synth' && manifestReady && hostedTracks.length > 0) {
            pauseScheduling(FADE_MS / 1000);
            playHosted();
          }
        })
        .catch(() => {
          /* 절대 throw 금지 */
        });
    }
  } catch {
    /* 절대 throw 금지 */
  }
}

export function stopBgm(): void {
  playing = false;
  try {
    pauseScheduling(0.5);
    pauseHosted(500);
  } catch {
    /* 절대 throw 금지 */
  }
}

export function isBgmPlaying(): boolean {
  return playing;
}

/** 현재 트랙 이름(UI 표시용) — 호스티드면 mp3 title, 합성이면 절차생성 트랙명. */
export function currentTrackName(): string {
  if (!playing) return '';
  if (mode === 'hosted') return hostedTracks[hostedIndex]?.title ?? '';
  return currentTrack().name;
}

/** 호스티드 트랙 크레딧(출처 표기용) — 합성 폴백 재생 중이거나 정지 상태면 null. */
export function currentTrackCredit(): BgmTrackCredit | null {
  if (!playing || mode !== 'hosted') return null;
  const t = hostedTracks[hostedIndex];
  if (!t) return null;
  return {
    title: t.title,
    ...(t.artist !== undefined ? { artist: t.artist } : {}),
    ...(t.license !== undefined ? { license: t.license } : {}),
    ...(t.creditUrl !== undefined ? { creditUrl: t.creditUrl } : {}),
  };
}
