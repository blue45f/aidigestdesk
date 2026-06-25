// 파티클/리플 이펙트 — 순수 DOM + Web Animations API(에셋 0). 웹·토스 공용. reduced-motion 존중.
const DEFAULT_COLORS = ['#6ea8fe', '#74d6a3', '#f5c842', '#ff6b6b', '#eaf1ff'];

function reduced(): boolean {
  return (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** 한 지점에서 컬러 파티클을 사방으로 터뜨림(좌표 기준). */
export function burstAt(x: number, y: number, colors: string[] = DEFAULT_COLORS, count = 20): void {
  if (reduced()) return;
  const layer = document.createElement('div');
  layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:99999;`;
  document.body.appendChild(layer);
  for (let i = 0; i < count; i += 1) {
    const p = document.createElement('span');
    const px = 5 + Math.round(Math.random() * 6);
    p.style.cssText = `position:absolute;left:0;top:0;width:${px}px;height:${px}px;border-radius:50%;background:${colors[i % colors.length]};will-change:transform,opacity;`;
    layer.appendChild(p);
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 38 + Math.random() * 62;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`, opacity: 0 },
      ],
      { duration: 620 + Math.random() * 260, easing: 'cubic-bezier(.16,.84,.44,1)' },
    );
  }
  window.setTimeout(() => layer.remove(), 1000);
}

/** 요소를 살짝 팝시키고 중심에서 파티클을 터뜨림(타이틀 탭용). */
export function burstParticles(host: HTMLElement | null, colors: string[] = DEFAULT_COLORS): void {
  if (!host || reduced()) return;
  host.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
    { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  );
  const rect = host.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, colors);
}

/** 탭 지점에서 퍼지는 링(모든 클릭 피드백). */
export function tapRipple(x: number, y: number, color = 'rgba(110,168,254,0.55)'): void {
  if (reduced()) return;
  const r = document.createElement('span');
  r.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:10px;height:10px;border-radius:50%;border:2px solid ${color};transform:translate(-50%,-50%);pointer-events:none;z-index:99998;will-change:transform,opacity;`;
  document.body.appendChild(r);
  r.animate(
    [
      { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0.7 },
      { transform: 'translate(-50%,-50%) scale(4.2)', opacity: 0 },
    ],
    { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' },
  );
  window.setTimeout(() => r.remove(), 540);
}
