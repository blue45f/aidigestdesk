// 타이틀 "팡" 파티클 버스트 — 순수 DOM + Web Animations API(에셋 0). 웹·토스 공용.
// host 요소를 살짝 팝시키고, 중심에서 컬러 파티클을 사방으로 터뜨린 뒤 정리한다.
const DEFAULT_COLORS = ['#6ea8fe', '#74d6a3', '#f5c842', '#ff6b6b', '#eaf1ff'];

export function burstParticles(host: HTMLElement | null, colors: string[] = DEFAULT_COLORS): void {
  if (!host || typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  // 타이틀 팝
  host.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
    { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  );

  const rect = host.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;pointer-events:none;z-index:99999;`;
  document.body.appendChild(layer);

  const count = 20;
  for (let i = 0; i < count; i += 1) {
    const p = document.createElement('span');
    const px = 5 + Math.round(Math.random() * 6);
    p.style.cssText = `position:absolute;left:0;top:0;width:${px}px;height:${px}px;border-radius:50%;background:${colors[i % colors.length]};will-change:transform,opacity;`;
    layer.appendChild(p);
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
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
