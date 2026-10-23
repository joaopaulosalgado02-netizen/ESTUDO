import { useCallback, useEffect, useRef, useState } from 'react';

export const STORAGE_KEY = 'lovestory.jemima-joao.v1';
export type SceneValue = boolean | number | string | number[];
export interface Progress { version: 1; page: number; opened: boolean; scenes: Record<string, SceneValue>; points: number; vouchers: number[] }
const fresh = (): Progress => ({ version: 1, page: 0, opened: false, scenes: {}, points: 0, vouchers: [] });
function load(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (value?.version !== 1 || !Number.isInteger(value.page) || value.page < 0 || value.page > 29) return fresh();
    const scenes: Record<string, SceneValue> = {};
    if (value.scenes && typeof value.scenes === 'object' && !Array.isArray(value.scenes)) {
      for (const [key, entry] of Object.entries(value.scenes)) {
        if (typeof entry === 'boolean' || typeof entry === 'string' || (typeof entry === 'number' && Number.isFinite(entry)) || (Array.isArray(entry) && entry.every(x => Number.isInteger(x)))) scenes[key] = entry as SceneValue;
      }
    }
    return { ...fresh(), page: value.page, opened: value.opened === true, scenes,
      points: Number.isInteger(value.points) && value.points >= 0 ? value.points : 0,
      vouchers: Array.isArray(value.vouchers) ? [...new Set<number>(value.vouchers.filter((x: unknown) => Number.isInteger(x) && Number(x) >= 0 && Number(x) < 4))] : [] };
  } catch { return fresh(); }
}

export function useProgress() {
  const [progress, setProgress] = useState(load);
  const latest = useRef(progress);
  latest.current = progress;

  // Saving is deferred until after paint. Page lifecycle events flush the latest
  // state so a quick reload still preserves the last gesture or signature.
  useEffect(() => {
    const save = () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(latest.current)); } catch { /* The album still works without storage. */ }
    };
    const timer = window.setTimeout(save, 120);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const flush = () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(latest.current)); } catch { /* Storage may be unavailable. */ }
    };
    const hidden = () => { if (document.hidden) flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);

  const update = useCallback((change: Partial<Progress> | ((previous: Progress) => Progress)) => {
    setProgress(previous => typeof change === 'function' ? change(previous) : { ...previous, ...change });
  }, []);
  const setScene = useCallback((key: string, value: SceneValue) => update(previous => Object.is(previous.scenes[key], value) ? previous : ({ ...previous, scenes: { ...previous.scenes, [key]: value } })), [update]);
  const reset = useCallback(() => { const next = fresh(); update(next); }, [update]);
  return { progress, update, setScene, reset };
}
