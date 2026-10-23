import { useLayoutEffect, useRef, type RefObject } from 'react';

export interface TurnSnapshot {
  id: number;
  direction: 1 | -1;
  face: HTMLElement;
  stationary: HTMLElement | null;
}

/** A DOM copy keeps the exact visual state without mounting another scene,
 * starting timers twice, or resetting an interaction while the leaf turns. */
export function copyPage(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.classList.add('page-copy');
  clone.removeAttribute('data-page');
  clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;
  // SVG gradients and masks must keep valid references in the copied leaf.
  const ids = new Map<string, string>();
  clone.querySelectorAll('[id]').forEach(element => {
    const before = element.id;
    const after = `${before}-leaf-${++copySequence}`;
    ids.set(before, after);
    element.id = after;
  });
  clone.querySelectorAll('*').forEach(element => {
    for (const attribute of [...element.attributes]) {
      let value = attribute.value;
      for (const [before, after] of ids) {
        value = value.split(`url(#${before})`).join(`url(#${after})`);
        if ((attribute.name === 'href' || attribute.name === 'xlink:href') && value === `#${before}`) value = `#${after}`;
        if (attribute.name === 'aria-labelledby' || attribute.name === 'aria-describedby') value = value.split(' ').map(id => id === before ? after : id).join(' ');
      }
      if (value !== attribute.value) element.setAttribute(attribute.name, value);
    }
  });
  const originals = [source, ...source.querySelectorAll<HTMLElement | SVGElement>('*')];
  const copies = [clone, ...clone.querySelectorAll<HTMLElement | SVGElement>('*')];
  for (const animation of source.getAnimations({ subtree: true })) {
    const effect = animation.effect as KeyframeEffect | null;
    const target = effect?.target;
    if (!(target instanceof HTMLElement || target instanceof SVGElement)) continue;
    const copy = copies[originals.indexOf(target)];
    if (!copy || !effect) continue;
    const computed = getComputedStyle(target);
    const properties = new Set(effect.getKeyframes().flatMap(frame => Object.keys(frame)));
    for (const property of properties) {
      if (['offset', 'computedOffset', 'easing', 'composite'].includes(property)) continue;
      const cssProperty = property.startsWith('--') ? property : property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const value = computed.getPropertyValue(cssProperty);
      if (value) copy.style.setProperty(cssProperty, value);
    }
  }
  const originalCanvases = source.querySelectorAll('canvas');
  clone.querySelectorAll('canvas').forEach((canvas, i) => {
    try { canvas.getContext('2d')?.drawImage(originalCanvases[i], 0, 0); } catch { /* Empty canvases need no copying. */ }
  });
  return clone;
}

let copySequence = 0;

function attachCopy(target: HTMLDivElement, snapshot: HTMLElement) {
  target.replaceChildren(snapshot);
  const scroll = snapshot.querySelector<HTMLElement>('.page-scroll');
  if (scroll) scroll.scrollTop = Number(snapshot.dataset.scrollTop || 0);
}

export function capturePage(source: HTMLElement) {
  const clone = copyPage(source);
  clone.dataset.scrollTop = String(source.querySelector('.page-scroll')?.scrollTop || 0);
  return clone;
}

export function PageTurn({ snapshot, spread, currentPages, done }: {
  snapshot: TurnSnapshot;
  spread: boolean;
  currentPages: RefObject<HTMLDivElement | null>;
  done: () => void;
}) {
  const front = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const still = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (front.current) attachCopy(front.current, snapshot.face);
    if (snapshot.stationary && still.current) attachCopy(still.current, snapshot.stationary);
    const reverseCopy = () => {
      const pages = currentPages.current?.querySelectorAll<HTMLElement>(':scope > .book-page');
      const reverse = pages?.[spread && snapshot.direction < 0 ? 1 : 0];
      if (reverse && back.current) { attachCopy(back.current, capturePage(reverse)); return true; }
      return false;
    };
    const ready = reverseCopy();
    let observer: MutationObserver | null = null;
    if (!ready && currentPages.current) observer = new MutationObserver(() => { if (reverseCopy()) observer?.disconnect(); });
    observer?.observe(currentPages.current!, { childList: true, subtree: true });
    // Snapshots have no event listeners. They are discarded after the animation.
    return () => observer?.disconnect();
  }, [snapshot, spread, currentPages]);

  return <div className={`turn-layer ${snapshot.direction < 0 ? 'is-backward' : ''}`} aria-hidden="true" inert>
    {spread && <div className="turn-stationary" ref={still}/>}
    <div className={`turn-leaf ${snapshot.direction < 0 ? 'turn-back' : 'turn-forward'}`} onAnimationEnd={event => { if (event.target === event.currentTarget) done(); }}>
      <div className="leaf-front" ref={front}/>
      <div className="leaf-back" ref={back}/>
    </div>
  </div>;
}
