import { useEffect, useId, useRef, useState } from 'react';
import { album } from '../../content/album';
import { prefersReducedMotion } from '../../lib/motion';
import { Flourish, Lock } from '../Art';
import type { SceneProps } from './types';
import '../../styles/keepsake.css';

type Phase = 'open' | 'aligning' | 'latching' | 'settling' | 'locked' | 'unlatching';
export function KeepsakeScene({ progress, setScene, closeBook, navigate }: SceneProps) {
  const [phase, setPhase] = useState<Phase>(() => progress.scenes.locked ? 'locked' : 'open');
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const id = useId();
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const latched = phase === 'latching' || phase === 'settling' || phase === 'locked';
  const sealed = phase === 'settling' || phase === 'locked';
  const toggle = () => {
    if (busy.current) return;
    const locking = phase === 'open';
    if (prefersReducedMotion()) { setPhase(locking ? 'locked' : 'open'); setScene('locked', locking); return; }
    busy.current = true;
    if (locking) {
      setPhase('aligning');
      timers.current.push(window.setTimeout(() => setPhase('latching'), 400));
      timers.current.push(window.setTimeout(() => setPhase('settling'), 1400));
      timers.current.push(window.setTimeout(() => { setPhase('locked'); setScene('locked', true); busy.current = false; }, 2750));
    } else {
      setPhase('unlatching');
      timers.current.push(window.setTimeout(() => { setPhase('open'); setScene('locked', false); busy.current = false; }, 1400));
    }
  };
  return <div className={`ending-scene bridge-ending ${sealed ? 'ending-locked' : ''}`} data-lock-phase={phase}>
    <span className="ending-eyebrow">ainda temos tantas páginas</span>
    <div className="bridge-keepsake">
      <svg className="keepsake-bridge" viewBox="0 0 300 300" aria-hidden="true"><defs><linearGradient id={id + '-sky'} x2="0" y2="1"><stop stopColor="#f4debd"/><stop offset=".55" stopColor="#e4bbb0"/><stop offset="1" stopColor="#bd8e92"/></linearGradient><linearGradient id={id + '-river'} x2="0" y2="1"><stop stopColor="#d3aca1"/><stop offset="1" stopColor="#a6878a"/></linearGradient></defs>
        <path d="M0 40Q150 0 300 40v210H0Z" fill={`url(#${id}-sky)`}/><circle cx="213" cy="83" r="23" fill="#f9e3b4" opacity=".8"/>
        <path d="m0 132 29-7 12-13 10 12 26-4 29 9 15-22 11 4 4 16 31-7 13 8 24-7 23 12 40-14 28 10v35H0Z" fill="#9d7f81" opacity=".3"/>
        <path d="M0 147q150-10 300 0v111H0Z" fill={`url(#${id}-river)`}/>
        <path d="M176 161h55m-68 8h89m-94 9h79m-123 17h73m-158-12h64m128 22h49m-178 20h81" fill="none" stroke="#edc7b0" strokeWidth="2" opacity=".6"/>
        <path d="M0 155q150-26 300 0M0 168q150-26 300 0" fill="none" stroke="#5f5752" strokeWidth="7"/>
        {Array.from({ length: 7 }, (_, index) => <g key={index} transform={`translate(${index * 48 - 18} 0)`}><path d="M0 166v111m43-114v114M0 198q22-35 43 0v31q-21 33-43 0Z" fill="none" stroke="#6e6259" strokeWidth="3"/><path d="M21 200v40m-9-25h18" stroke="#8b7864" strokeWidth="1.5"/></g>)}
        <path d="M0 281q150-12 300 0" fill="none" stroke="#685d54" strokeWidth="8"/>
        <path d="M0 290q150-14 300 0v10H0Z" fill="#a87e78"/>
        <path d="m29 74 6-4 6 4m11-19 5-3 5 3" fill="none" stroke="#ad8779" strokeWidth="1"/>
      </svg>
      <button className="art-button ending-lock" onClick={toggle} disabled={busy.current} aria-pressed={sealed} aria-label={sealed ? 'Abrir o cadeado de lembranças' : 'Fechar o cadeado de lembranças'}><Lock locked={latched}/></button>
      <span className="bridge-date">Jemima &amp; João · a nossa história continua</span>
    </div>
    <p className="ending-message state-copy" aria-live="polite"><span className={!sealed ? 'copy-visible' : ''} aria-hidden={sealed}>Um lugar para guardar<br/>tudo que já vivemos.</span><span className={sealed ? 'copy-visible' : ''} aria-hidden={!sealed}>{album.finalMessage}</span></p>
    <span className="handwritten ending-signoff">{sealed ? 'Com carinho, João.' : 'Toque no cadeado para fechar o nosso capítulo.'}</span>
    <span className="ending-saved" role="status">{phase === 'aligning' ? 'Encaixando no corrimão…' : phase === 'latching' ? 'Fechando o arco, com cuidado…' : phase === 'settling' ? 'Uma lembrança fica. A nossa história continua.' : phase === 'unlatching' ? 'Abrindo para viver de novo…' : sealed ? 'Guardado neste aparelho, com carinho.' : 'E deixar o próximo aberto para nós.'}</span>
    <Flourish/><div className="ending-links"><button className="small-link" onClick={closeBook}>Voltar à capa</button><button className="small-link" onClick={() => navigate(8)}>Rever o começo</button><button className="small-link" onClick={() => navigate(21)}>Ver os vídeos</button></div>
  </div>;
}
