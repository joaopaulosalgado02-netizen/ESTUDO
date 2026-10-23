import { useEffect, useState, useSyncExternalStore } from 'react';

type MotionChoice = 'system' | 'full' | 'reduced';
const MOTION_KEY = 'lovestory.motion.v1';
const MOTION_EVENT = 'lovestory:motion-change';
let choice: MotionChoice = 'system';

function applyMotion() {
  const reduced = choice === 'reduced' || (choice === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
}

export function initializeMotion() {
  const requested = new URLSearchParams(location.search).get('motion');
  try {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved === 'full' || saved === 'reduced') choice = saved;
    if (requested === 'full' || requested === 'reduced' || requested === 'system') {
      choice = requested;
      localStorage.setItem(MOTION_KEY, choice);
    }
  } catch { if (requested === 'full' || requested === 'reduced') choice = requested; }
  applyMotion();
}

export function prefersReducedMotion() { return document.documentElement.dataset.motion === 'reduced'; }

function toggleMotion() {
  choice = prefersReducedMotion() ? 'full' : 'reduced';
  try { localStorage.setItem(MOTION_KEY, choice); } catch { /* Still works in memory. */ }
  applyMotion();
  window.dispatchEvent(new Event(MOTION_EVENT));
}

function subscribeMotion(update: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const systemChanged = () => { applyMotion(); update(); };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== MOTION_KEY) return;
    choice = event.newValue === 'full' || event.newValue === 'reduced' ? event.newValue : 'system';
    applyMotion(); update();
  };
  media.addEventListener('change', systemChanged);
  window.addEventListener(MOTION_EVENT, update);
  window.addEventListener('storage', storageChanged);
  return () => { media.removeEventListener('change', systemChanged); window.removeEventListener(MOTION_EVENT, update); window.removeEventListener('storage', storageChanged); };
}

export function useMotionPreference() {
  const reduced = useSyncExternalStore(subscribeMotion, prefersReducedMotion);
  return { reduced, toggleMotion };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function useVisibilityMotion() {
  useEffect(() => {
    const update = () => { document.documentElement.dataset.visibility = document.hidden ? 'hidden' : 'visible'; };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
}
