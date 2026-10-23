import { prefersReducedMotion } from '../lib/motion';
import { useCallback, useEffect, useLayoutEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Icon } from './Art';
import { Photo, photos, caption } from './Photo';
import { preloadPhoto } from '../lib/media';
import type { OverlayOrigin } from '../lib/overlay-motion';

const galleryImageSizes = '(max-width: 600px) calc(100vw - 72px), (max-width: 800px) calc(100vw - 84px), 700px';

export type ModalContent = ({ kind: 'gallery'; label: string } | { kind: 'text'; title: string; text: string } | { kind: 'video'; index: number } | { kind: 'contents' } | { kind: 'reset' }) & { origin?: OverlayOrigin };

export function Modal({ title, children, close, wide = false, origin, variant = 'default' }: { title: string; children: ReactNode; close: () => void; wide?: boolean; origin?: OverlayOrigin; variant?: 'letter'|'photo'|'contents'|'video'|'default' }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const openingAnimation = useRef<Animation | null>(null);
  const closingAnimation = useRef<Animation | null>(null);
  const geometry = useRef({ x: 0, y: 30, scale: .92 });
  const afterClose = useRef<(() => void) | undefined>(undefined);
  const backdropDown = useRef(false);
  const closeRef = useRef(close);
  closeRef.current = close;
  const requestClose = useCallback((after?: () => void) => {
    if (closingRef.current) return;
    closingRef.current = true;
    afterClose.current = after;
    ref.current?.querySelectorAll('video').forEach(video => video.pause());
    if (prefersReducedMotion()) {
      closeRef.current(); afterClose.current?.();
      return;
    }
    setClosing(true);
    const dialog = ref.current!;
    const style = getComputedStyle(dialog);
    const from = { transform: style.transform, opacity: style.opacity };
    const { x, y, scale } = geometry.current;
    openingAnimation.current?.cancel();
    const duration = variant === 'letter' ? 440 : 360;
    closingAnimation.current = dialog.animate([
      { transform: from.transform === 'none' ? 'translate3d(0,0,0) scale(1)' : from.transform, opacity: from.opacity },
      { transform: `translate3d(${x * .8}px,${y * .8}px,0) scale(${Math.max(.3,scale)},${variant === 'letter' ? .35 : Math.max(.3,scale)})`, opacity: .7, offset: .7 },
      { transform: `translate3d(${x}px,${y}px,0) scale(${scale},${variant === 'letter' ? .08 : scale})`, opacity: 0 },
    ], { duration, easing: 'cubic-bezier(.4,0,.3,1)', fill: 'forwards' });
    closeTimer.current = window.setTimeout(() => { closeRef.current(); afterClose.current?.(); }, duration);
  }, [variant]);
  useLayoutEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    const rect = dialog.getBoundingClientRect();
    const anchor = origin || { x: rect.left + rect.width / 2, y: rect.top + rect.height * .7, width: rect.width * .9, height: 40 };
    geometry.current = { x: anchor.x + anchor.width / 2 - (rect.left + rect.width / 2), y: anchor.y + anchor.height / 2 - (rect.top + rect.height / 2), scale: origin ? Math.min(.75,Math.max(.18,anchor.width / rect.width)) : .94 };
    if (!prefersReducedMotion()) {
      const { x, y, scale } = geometry.current;
      openingAnimation.current = dialog.animate([
        { transform: `translate3d(${x}px,${y}px,0) rotate(${variant === 'letter' ? '-3deg' : '0deg'}) scale(${scale},${variant === 'letter' ? .12 : scale})`, opacity: 0 },
        { transform: `translate3d(${x * .3}px,${y * .3 - 12}px,0) rotate(-.5deg) scale(.92,.85)`, opacity: .95, offset: .64 },
        { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', opacity: 1 },
      ], { duration: variant === 'letter' ? 620 : 480, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'both' });
    }
    const cancel = (event: Event) => { event.preventDefault(); requestClose(); };
    const closeRequested = (event: Event) => requestClose((event as CustomEvent<{after?:()=>void}>).detail?.after);
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), video[controls], summary, [tabindex]:not([tabindex="-1"])')].filter(element => element.getClientRects().length > 0);
      const first = elements[0], last = elements.at(-1);
      if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('cancel', cancel);
    dialog.addEventListener('keydown', trap);
    dialog.addEventListener('lovestory:request-close', closeRequested);
    return () => {
      clearTimeout(closeTimer.current);
      openingAnimation.current?.cancel(); closingAnimation.current?.cancel();
      dialog.removeEventListener('cancel', cancel);
      dialog.removeEventListener('keydown', trap);
      dialog.removeEventListener('lovestory:request-close', closeRequested);
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [requestClose, origin, variant]);
  return <dialog
    ref={ref}
    className={`modal ${wide ? 'wide' : ''} ${closing ? 'is-closing' : ''}`}
    aria-labelledby={titleId}
    data-variant={variant}
    onPointerDown={event => { backdropDown.current = event.target === event.currentTarget; }}
    onClick={event => {
      if (event.target === event.currentTarget && backdropDown.current) requestClose();
      backdropDown.current = false;
    }}
  ><div className="modal-shell"><header><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label="Fechar" onClick={() => requestClose()}><Icon name="close"/></button></header>{children}</div></dialog>;
}

function GalleryThumbnail({ label, selected, scroller, select }: { label: string; selected: boolean; scroller: RefObject<HTMLDivElement | null>; select: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(selected);
  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { root: scroller.current, rootMargin: '0px 64px', threshold: 0 });
    const button = ref.current;
    if (button) observer.observe(button);
    return () => observer.disconnect();
  }, [visible, scroller]);
  return <button ref={ref} type="button" aria-label={`Ver ${caption(label)}`} aria-current={selected ? 'true' : undefined} tabIndex={selected ? 0 : -1} onClick={select}>
    {visible || selected ? <Photo label={label} className="gallery-thumb-image" showCaption={false} alt="" sizes="44px"/> : <span className="gallery-thumb-placeholder" aria-hidden="true"/>}
  </button>;
}

export function Gallery({ initial }: { initial: string }) {
  const [{ index, direction }, setSelection] = useState(() => ({ index: Math.max(0, photos.findIndex(item => item.label === initial)), direction: 0 }));
  const [shown, setShown] = useState(() => ({ index: Math.max(0, photos.findIndex(item => item.label === initial)), previous: null as number | null, direction: 0 }));
  const fadeTimer = useRef<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; pointer: number } | null>(null);
  const label = photos[index].label;
  const navigate = useCallback((delta: number) => {
    setSelection(previous => ({ index: (previous.index + delta + photos.length) % photos.length, direction: Math.sign(delta) }));
  }, []);

  useEffect(() => {
    if (index === shown.index) return;
    let cancelled = false;
    const image = preloadPhoto(photos[index].label, galleryImageSizes);
    const reveal = () => {
      if (cancelled) return;
      clearTimeout(fadeTimer.current);
      setShown(previous => ({ index, previous: previous.index, direction }));
      // Keep the decoded outgoing node for one short overlap even without
      // motion: the incoming React img still needs its own load event.
      fadeTimer.current = window.setTimeout(() => setShown(previous => ({ ...previous, previous: null })), 500);
    };
    void image.decode().then(reveal, reveal);
    return () => { cancelled = true; };
  }, [index, direction, shown.index]);
  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    const dialog = ref.current?.closest('dialog');
    if (!dialog) return;
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') navigate(event.key === 'ArrowRight' ? 1 : -1);
      else setSelection({ index: event.key === 'Home' ? 0 : photos.length - 1, direction: 0 });
    };
    dialog.addEventListener('keydown', keyboard);
    return () => dialog.removeEventListener('keydown', keyboard);
  }, [navigate]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || connection?.effectiveType?.includes('2g')) return;
    const adjacent = [preloadPhoto(photos[(index + photos.length - 1) % photos.length].label, galleryImageSizes), preloadPhoto(photos[(index + 1) % photos.length].label, galleryImageSizes)];
    return () => { adjacent.forEach(image => { image.onload = null; image.onerror = null; }); };
  }, [index]);

  useEffect(() => {
    const scroller = thumbs.current;
    const selected = scroller?.querySelector<HTMLButtonElement>('[aria-current="true"]');
    if (!scroller || !selected) return;
    const focusedInThumbs = scroller.contains(document.activeElement);
    scroller.scrollTo({ left: selected.offsetLeft - scroller.offsetLeft - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    if (focusedInThumbs) selected.focus({ preventScroll: true });
  }, [index]);

  return <div ref={ref} className="gallery">
    <div
      className="gallery-stage"
      data-direction={shown.direction < 0 ? 'back' : 'forward'}
      aria-busy={shown.index !== index}
      data-gesture="true"
      onPointerDown={event => {
        if (!event.isPrimary) { swipe.current = null; return; }
        swipe.current = { x: event.clientX, y: event.clientY, pointer: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={event => {
        const start = swipe.current;
        swipe.current = null;
        if (!start || start.pointer !== event.pointerId) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => { swipe.current = null; }}
      onLostPointerCapture={() => { swipe.current = null; }}
    >{[...(shown.previous === null ? [] : [shown.previous]), shown.index].map(photoIndex => <Photo key={photos[photoIndex].label} label={photos[photoIndex].label} className={`gallery-photo ${photoIndex === shown.index ? 'gallery-current' : 'gallery-outgoing'}`} ariaHidden={photoIndex !== shown.index} eager showCaption={false} sizes={galleryImageSizes}/> )}</div>
    <p className="gallery-status" aria-live="polite" aria-atomic="true"><span className="visually-hidden">Foto {index + 1} de {photos.length}: </span>{caption(label)}</p>
    <div className="gallery-nav"><button type="button" className="icon-button" aria-label="Foto anterior" onClick={() => navigate(-1)}><Icon name="back"/></button><span>{String(index + 1).padStart(2, '0')} / {photos.length}</span><button type="button" className="icon-button" aria-label="Próxima foto" onClick={() => navigate(1)}><Icon name="next"/></button></div>
    <p className="gallery-hint">Deslize a foto ou use as setas para folhear.</p>
    <div ref={thumbs} className="gallery-thumbs" role="group" aria-label="Escolher uma fotografia">{photos.map((photo, i) => <GalleryThumbnail key={photo.id} label={photo.label} selected={index === i} scroller={thumbs} select={() => setSelection(previous => ({ index: i, direction: Math.sign(i - previous.index) }))}/>)}</div>
  </div>;
}
