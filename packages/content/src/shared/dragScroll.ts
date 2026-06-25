// 가로 스크롤 레일 고도화 — 마우스 드래그로 스크롤 + 관성(momentum). 웹·토스 공용, 의존성 0.
// 터치는 네이티브 스크롤에 맡기고(간섭 X), 데스크톱 포인터 드래그만 보강한다.
// 드래그 중 발생하는 클릭은 한 번 차단해 칩/카드가 오작동하지 않게 한다.
export function attachDragScroll(el: HTMLElement): () => void {
  if (typeof window === 'undefined') return () => {};

  let down = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0; // px/ms
  let raf = 0;
  let suppressClick = false;

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return; // 모바일은 네이티브 스크롤
    if (el.scrollWidth <= el.clientWidth + 2) return; // 스크롤 필요 없으면 무시
    down = true;
    startX = e.clientX;
    startScroll = el.scrollLeft;
    lastX = e.clientX;
    lastT = now();
    velocity = 0;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    cancelAnimationFrame(raf);
  };

  const onMove = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) suppressClick = true;
    el.scrollLeft = startScroll - dx;
    const t = now();
    const dt = t - lastT;
    if (dt > 0) velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastT = t;
  };

  const onUp = () => {
    if (!down) return;
    down = false;
    el.style.cursor = 'grab';
    el.style.userSelect = '';
    let v = velocity * 16; // 프레임당 px
    const decay = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft -= v;
      v *= 0.92;
      raf = requestAnimationFrame(decay);
    };
    raf = requestAnimationFrame(decay);
    if (suppressClick) window.setTimeout(() => (suppressClick = false), 60);
  };

  const onClickCapture = (e: MouseEvent) => {
    if (suppressClick) {
      e.stopPropagation();
      e.preventDefault();
      suppressClick = false;
    }
  };

  el.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  el.addEventListener('click', onClickCapture, true);
  if (el.scrollWidth > el.clientWidth + 2) el.style.cursor = 'grab';

  return () => {
    el.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    el.removeEventListener('click', onClickCapture, true);
    cancelAnimationFrame(raf);
    el.style.cursor = '';
  };
}

/**
 * 컨테이너 내 가로 스크롤 레일들에 드래그 스크롤을 일괄 부착(멱등). route 변경 시 재호출.
 * 대상: data-xrail 속성 또는 .chips 클래스를 가진 요소.
 */
const ATTACHED = new WeakSet<HTMLElement>();
export function enhanceRails(root: ParentNode = document): () => void {
  if (typeof document === 'undefined') return () => {};
  const els = [...root.querySelectorAll<HTMLElement>('[data-xrail], .chips')];
  const cleanups: Array<() => void> = [];
  for (const el of els) {
    if (ATTACHED.has(el)) continue;
    ATTACHED.add(el);
    cleanups.push(attachDragScroll(el));
  }
  return () => cleanups.forEach((fn) => fn());
}
