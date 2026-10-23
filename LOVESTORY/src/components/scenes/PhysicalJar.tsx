import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useId, useRef, useState } from 'react';
import { album } from '../../content/album';
import { Icon } from '../Art';
import type { SceneProps } from './types';
import '../../styles/physical-jar.css';

const DRAW_MS = 3200;
type Phase = 'rest' | 'putting-away' | 'drawing';

/** The paper stays one DOM object: it clears the mouth before the clipping is released. */
export function PhysicalJar({ progress, setScene }: SceneProps) {
  const saved = progress.scenes.noteCount;
  const count = typeof saved === 'number' && Number.isFinite(saved) ? Math.max(0, Math.floor(saved)) : 0;
  const [shownCount, setShownCount] = useState(count);
  const [phase, setPhase] = useState<Phase>('rest');
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const followTimer = useRef<number | undefined>(undefined);
  const stage = useRef<HTMLDivElement>(null);
  const glassId = useId();
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(followTimer.current); }, []);

  const followPaper = (behavior: ScrollBehavior) => {
    const node = stage.current;
    const scroll = node?.closest<HTMLElement>('.page-scroll');
    if (!node || !scroll) return;
    const overflow = node.getBoundingClientRect().bottom + 70 - scroll.getBoundingClientRect().bottom;
    if (overflow > 0) scroll.scrollTo({ top: scroll.scrollTop + overflow + 8, behavior });
  };

  const takeNote = () => {
    if (busy.current) return;
    const next = count + 1;
    if (prefersReducedMotion()) {
      setShownCount(next); setScene('noteCount', next); followPaper('instant'); return;
    }
    busy.current = true;
    const draw = () => {
      setShownCount(next);
      setPhase('drawing');
      // On short screens the reading area follows the descending paper, so it
      // never lands behind the folio. The ascent remains fully visible first.
      followTimer.current = window.setTimeout(() => followPaper('smooth'), 1900);
      timer.current = window.setTimeout(() => {
        setPhase('rest'); setScene('noteCount', next); busy.current = false;
      }, DRAW_MS);
    };
    if (shownCount) {
      setPhase('putting-away');
      timer.current = window.setTimeout(draw, 380);
    } else draw();
  };
  const working = phase !== 'rest';
  const note = shownCount ? album.notes[(shownCount - 1) % album.notes.length] : '';
  return <div className="physical-jar" data-phase={phase} aria-busy={working}>
    <div className="physical-jar-stage" ref={stage}>
      <button className="physical-jar-touch" onClick={takeNote} disabled={working} aria-label="Tirar um bilhete do pote">
        <svg className="physical-jar-glass" viewBox="0 0 280 300" aria-hidden="true">
          <defs><linearGradient id={glassId} x2="1" y2=".3"><stop stopColor="#fff" stopOpacity=".55"/><stop offset=".4" stopColor="#fff" stopOpacity=".08"/><stop offset="1" stopColor="#b8c6b3" stopOpacity=".45"/></linearGradient></defs>
          <ellipse cx="140" cy="279" rx="92" ry="10" fill="#533d31" opacity=".12"/>
          <path d="M91 66h98v31c2 12 32 17 35 47v99q0 28-31 29H87q-31-1-31-29v-99c3-30 33-35 35-47Z" fill={`url(#${glassId})`} stroke="#a5ada2" strokeWidth="2"/>
          <ellipse cx="140" cy="69" rx="48" ry="5" fill="#918f7580"/>
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={77 + i % 3 * 38} y={153 + Math.floor(i / 3) * 28} width="44" height="24" rx="2" fill={['#e0b9b6', '#efe0ab', '#bdc8ae'][i % 3]} stroke="#ad9275" transform={`rotate(${(i % 3 - 1) * 18} ${99 + i % 3 * 38} ${165 + Math.floor(i / 3) * 28})`}/>)}
          <path d="M73 144v92q0 16 13 18" fill="none" stroke="white" strokeWidth="5" opacity=".6"/>
          <path d="M90 99c25 7 75 7 100 0" fill="none" stroke="#a3a99a"/>
          <rect x="92" y="121" width="96" height="40" rx="3" fill="#f7e9d3" stroke="#c7b28c"/>
          <text x="140" y="146" textAnchor="middle" fontFamily="Georgia" fontSize="15" fill="#825453">para Mima</text>
        </svg>
        <svg className="physical-jar-lid" viewBox="0 0 110 30" aria-hidden="true"><rect x="1" y="1" width="108" height="28" rx="7" fill="#af865c" stroke="#785a3e"/><path d="M9 9h92M16 21h80" stroke="#c6a17b" strokeWidth="2"/></svg>
      </button>
      {shownCount > 0 && <>
        <span className="physical-jar-paper-shadow" aria-hidden="true"/>
        <div className="physical-jar-flight">
          <div className="physical-jar-paper jar-note visible" data-note={shownCount}>
            <span className="physical-jar-fold" aria-hidden="true"/>
            <span className="physical-jar-ink" aria-hidden="true">{note}</span>
            <span className="physical-jar-signature" aria-hidden="true">com carinho, João ♡</span>
          </div>
        </div>
      </>}
      {!shownCount && <p className="physical-jar-invitation">Um pequeno carinho<br/>guardado para você.</p>}
    </div>
    <button className="text-button" disabled={working} onClick={takeNote}>{count ? 'Mais um bilhete' : 'Tirar um bilhete'} <Icon name="heart" size={15}/></button>
    <small className="hint" aria-live="polite">{working ? phase === 'putting-away' ? 'Guardando este carinho…' : 'Abrindo um carinho para você…' : `${Math.min(count, album.notes.length)} de ${album.notes.length} bilhetes descobertos${count >= album.notes.length ? ' · vamos reler?' : ''}`}</small>
    <span className="physical-jar-reader" role="status">{!working ? note : ''}</span>
  </div>;
}
