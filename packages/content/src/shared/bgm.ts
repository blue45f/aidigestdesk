// 배경음악 — Web Audio 로 절차적 생성하는 잔잔한 앰비언트 패드(에셋 0·저작권 0). 웹·토스 공용.
// 4가지 무드 트랙이 로테이션(각 트랙 2회 순환 후 다음). 자동재생 안 함(토글=유저 제스처로 시작).
import { getAudioContext } from './sound';

interface Track {
  name: string;
  prog: number[][]; // 코드 진행(각 코드 = 주파수 배열 Hz)
  osc: OscillatorType;
}

// 따뜻한 중음역 보이싱. 모두 저작권 free(직접 합성한 일반 코드 진행).
const TRACKS: Track[] = [
  {
    name: '잔잔 로파이',
    osc: 'triangle',
    prog: [
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [196.0, 246.94, 293.66, 392.0], // G
    ],
  },
  {
    name: '몽환',
    osc: 'sine',
    prog: [
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 349.23], // G7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0], // Am7
    ],
  },
  {
    name: '산뜻',
    osc: 'triangle',
    prog: [
      [261.63, 329.63, 392.0], // C
      [196.0, 246.94, 293.66, 392.0], // G
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63, 349.23], // F
    ],
  },
  {
    name: '차분',
    osc: 'sine',
    prog: [
      [164.81, 196.0, 246.94, 293.66], // Em7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [196.0, 246.94, 293.66, 392.0], // G
      [293.66, 369.99, 440.0], // D
    ],
  },
];

const CHORD_SECONDS = 5.5;
const CYCLES_PER_TRACK = 2; // 트랙당 진행 2회 순환 후 다음 트랙으로 로테이션

let master: GainNode | null = null;
let timer: number | null = null;
let playing = false;
let chordCounter = 0; // 시작 이후 누적 코드 수

const FALLBACK_TRACK = TRACKS[0] as Track;

function currentTrack(): Track {
  const prog = 4; // 모든 트랙 4코드
  return TRACKS[Math.floor(chordCounter / (prog * CYCLES_PER_TRACK)) % TRACKS.length] ?? FALLBACK_TRACK;
}

function playChord() {
  const ctx = getAudioContext();
  if (!ctx || !master) return;
  const track = currentTrack();
  const chord = track.prog[chordCounter % track.prog.length] ?? track.prog[0] ?? [];
  const now = ctx.currentTime;
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = track.osc;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6; // 살짝 디튠 → 따뜻함
    const peak = 0.16 / (i + 1); // 높은 음일수록 작게
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 1.8); // 느린 어택
    gain.gain.linearRampToValueAtTime(0, now + CHORD_SECONDS + 1.2); // 긴 릴리즈(겹침)
    osc.connect(gain).connect(master!);
    osc.start(now);
    osc.stop(now + CHORD_SECONDS + 1.3);
  });
  chordCounter += 1;
}

let visibilityBound = false;

// 스케줄 시작(게인 페이드인 + 코드 루프). fadeSeconds 로 첫 진입은 부드럽게.
function resumeScheduling(fadeSeconds: number) {
  const ctx = getAudioContext();
  if (!ctx) return;
  master ??= ctx.createGain();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + fadeSeconds);
  master.connect(ctx.destination);
  playChord();
  if (timer) clearInterval(timer);
  timer = (globalThis.setInterval as Window['setInterval'])(playChord, CHORD_SECONDS * 1000);
}

// 스케줄 정지(게인 페이드아웃 + 타이머 해제). playing 플래그는 호출부가 관리.
function pauseScheduling(fadeSeconds: number) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  const ctx = getAudioContext();
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fadeSeconds);
  }
}

export function startBgm(): void {
  if (playing) return;
  if (!getAudioContext()) return;
  playing = true;
  resumeScheduling(1.2); // 첫 시작은 1.2s 페이드인 — 갑작스럽지 않게
  // 탭이 숨겨지면(다른 탭/앱) 자동 일시정지, 돌아오면 재개 — 백그라운드 소음 방지(1회 바인딩).
  if (!visibilityBound && typeof document !== 'undefined') {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!playing) return;
      if (document.hidden) pauseScheduling(0.4);
      else resumeScheduling(0.8);
    });
  }
}

export function stopBgm(): void {
  playing = false;
  pauseScheduling(0.6);
}

export function isBgmPlaying(): boolean {
  return playing;
}

/** 현재 재생 중인 트랙 이름(UI 표시용). */
export function currentTrackName(): string {
  return playing ? currentTrack().name : '';
}
