import { useLayoutEffect, useRef } from 'react';
import { copyPage } from './PageTurn';

export interface CoverSample {
  face: HTMLElement;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function sampleCover(): CoverSample | null {
  const face = document.querySelector<HTMLElement>('.cover-stage .book-cover');
  if (!face) return null;
  const rect = face.getBoundingClientRect();
  return { face: copyPage(face), width: face.offsetWidth, height: face.offsetHeight, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function bookCopy(source: HTMLElement) {
  const clone = copyPage(source);
  clone.querySelectorAll('[data-page]').forEach(page => page.removeAttribute('data-page'));
  // Introductory reveals are finished before the physical page is exposed.
  // Preserve every other interaction's current state, including scroll/canvas.
  clone.querySelectorAll<HTMLElement>('.page-heading,.page-scene').forEach(node => { node.style.opacity = '1'; node.style.transform = 'none'; });
  clone.querySelectorAll('img').forEach(image => {
    image.loading = 'eager';
    const ready = () => {
      const holder = image.closest<HTMLElement>('.photo-image');
      if (holder && image.naturalWidth) { holder.dataset.state = 'ready'; holder.setAttribute('aria-busy', 'false'); image.style.opacity = '1'; }
    };
    if (image.complete) ready(); else image.addEventListener('load', ready, { once: true });
  });
  return clone;
}

/** The real reader mounts before the hinge starts and survives the handoff.
 * Inert, frozen DOM copies let both faces travel without running scenes twice. */
export function BookMechanism({ mode, sample, wide, started, done }: {
  mode: 'opening' | 'closing';
  sample: CoverSample | null;
  wide: boolean;
  started: () => void;
  done: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ started, done });
  callbacks.current = { started, done };

  useLayoutEffect(() => {
    let cancelled = false;
    let frame = 0;
    let fallback = 0;
    let finished = false;
    const animations: Animation[] = [];
    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      callbacks.current.done();
    };
    const nextFrame = () => new Promise<void>(resolve => { frame = requestAnimationFrame(() => resolve()); });
    const prepare = async () => {
      const deadline = performance.now() + 4500;
      let book: HTMLElement | null = null;
      let spread: HTMLElement | null = null;
      while (!cancelled) {
        book = document.querySelector<HTMLElement>('.reading-room .open-book');
        spread = book?.querySelector<HTMLElement>('.book-spread') ?? null;
        if (spread?.querySelector('.book-page') && !spread.querySelector('.scene-loading')) break;
        if (performance.now() > deadline) { finish(); return; }
        await nextFrame();
      }
      if (cancelled || !book || !spread || !root.current) return;
      // Decode the currently visible photographs before freezing their face.
      spread.querySelectorAll<HTMLElement>('.page-heading,.page-scene').forEach(node => node.getAnimations().forEach(animation => animation.finish()));
      const images = [...spread.querySelectorAll('img')];
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.race([Promise.allSettled(images.map(image => image.decode())), new Promise(resolve => { fallback = window.setTimeout(resolve, 800); })]);
      clearTimeout(fallback);
      await nextFrame();
      if (cancelled || !root.current) return;
      const cover = mode === 'closing' ? sampleCover() : sample;
      if (!cover) { finish(); return; }
      const bounds = book.getBoundingClientRect();
      const leafWidth = bounds.width / (wide ? 2 : 1);
      const leafLeft = wide ? leafWidth : 0;
      const shell = root.current.querySelector<HTMLElement>('.mechanical-shell')!;
      const deck = root.current.querySelector<HTMLElement>('.mechanical-page-deck')!;
      const hinge = root.current.querySelector<HTMLElement>('.mechanical-cover')!;
      const front = root.current.querySelector<HTMLElement>('.mechanical-cover-content')!;
      const back = root.current.querySelector<HTMLElement>('.mechanical-cover-back')!;
      const shade = root.current.querySelector<HTMLElement>('.mechanical-page-shade')!;
      Object.assign(shell.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px`, transformOrigin: `${leafLeft + leafWidth / 2}px ${bounds.height / 2}px` });
      Object.assign(hinge.style, { left: `${leafLeft}px`, width: `${leafWidth}px` });
      const pages = bookCopy(spread);
      deck.replaceChildren(pages);
      spread.querySelectorAll('.page-scroll').forEach((scroll, index) => { pages.querySelectorAll('.page-scroll')[index].scrollTop = scroll.scrollTop; });
      const face = cover.face.cloneNode(true) as HTMLElement;
      face.removeAttribute('disabled');
      Object.assign(front.style, { width: `${cover.width}px`, height: `${cover.height}px`, transform: `scale(${leafWidth / cover.width},${bounds.height / cover.height})` });
      front.replaceChildren(face);
      // On a spread the inside of the cover becomes its left page. On a phone
      // it continues beyond the left edge, keeping the reading page in place.
      if (wide) {
        const left = spread.querySelector<HTMLElement>('.book-page');
        if (left) { const reverse = bookCopy(left); back.replaceChildren(reverse); const scroll = reverse.querySelector('.page-scroll'); if (scroll) scroll.scrollTop = left.querySelector('.page-scroll')?.scrollTop || 0; }
      }
      const closed = `translate(${cover.x - bounds.x - leafLeft - leafWidth / 2}px,${cover.y - bounds.y - bounds.height / 2}px) rotateZ(-5deg) scale(${cover.width / leafWidth},${cover.height / bounds.height})`;
      const duration = mode === 'opening' ? 2650 : 2350;
      const options: KeyframeAnimationOptions = { duration, fill: 'both', direction: mode === 'opening' ? 'normal' : 'reverse', easing: 'linear' };
      animations.push(shell.animate([
        { transform: closed, offset: 0, easing: 'cubic-bezier(.22,.65,.3,1)' },
        { transform: 'translate(0,0) rotateZ(0deg) scale(1)', offset: .58 },
        { transform: 'translate(0,0) rotateZ(0deg) scale(1)', offset: 1 },
      ], options));
      animations.push(hinge.animate([
        { transform: 'rotateY(0deg)', offset: 0 },
        { transform: 'rotateY(-8deg)', offset: .2, easing: 'cubic-bezier(.4,0,.55,1)' },
        { transform: 'rotateY(-88deg)', offset: .5, easing: 'cubic-bezier(.3,.05,.25,1)' },
        { transform: 'rotateY(-163deg)', offset: .82, easing: 'ease-out' },
        { transform: 'rotateY(-180deg)', offset: 1 },
      ], options));
      if (wide) animations.push(deck.animate([
        { clipPath: 'inset(0 0 0 50%)', offset: 0 },
        { clipPath: 'inset(0 0 0 50%)', offset: .47, easing: 'ease-out' },
        { clipPath: 'inset(0 0 0 0%)', offset: .94 },
        { clipPath: 'inset(0 0 0 0%)', offset: 1 },
      ], options));
      animations.push(shade.animate([{ opacity: .44, offset: 0 }, { opacity: .36, offset: .35 }, { opacity: 0, offset: .94 }, { opacity: 0, offset: 1 }], options));
      root.current.dataset.ready = 'true';
      callbacks.current.started();
      window.addEventListener('resize', finish, { once: true });
      void Promise.all(animations.map(animation => animation.finished)).then(finish).catch(() => { /* Cleanup cancels animations. */ });
      fallback = window.setTimeout(finish, duration + 250);
    };
    void prepare();
    return () => { cancelled = true; cancelAnimationFrame(frame); clearTimeout(fallback); animations.forEach(animation => animation.cancel()); window.removeEventListener('resize', finish); };
  }, [mode, sample, wide]);

  return <div className={`book-mechanism ${wide ? 'spread' : 'single'}`} ref={root} data-mode={mode} aria-hidden="true" inert>
    <div className="mechanical-shell">
      <div className="mechanical-page-deck"/>
      <div className="mechanical-page-shade"/>
      <div className="mechanical-cover"><div className="mechanical-cover-front"><div className="mechanical-cover-content"/></div><div className="mechanical-cover-back"/></div>
    </div>
  </div>;
}
