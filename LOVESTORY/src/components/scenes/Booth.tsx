import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useRef, useState } from 'react';
import { photoStory } from '../../content/photo-story';
import { Icon } from '../Art';
import { Photo } from '../Photo';
import type { SceneProps } from './types';
import '../../styles/physical-booth.css';

type PrintPhase = 'idle' | 'capturing' | 'printing' | 'ready' | 'retracting';
const PRINT_MS = 3700;
const RETRACT_MS = 760;

export function Booth({ progress, setScene, openModal }: SceneProps) {
  const [phase, setPhase] = useState<PrintPhase>(() => progress.scenes.booth ? 'ready' : 'idle');
  const timer = useRef<number | undefined>(undefined);
  const locked = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const busy = phase === 'capturing' || phase === 'printing' || phase === 'retracting';

  const print = () => {
    if (locked.current) return;
    if (prefersReducedMotion()) {
      setScene('booth', 1);
      setPhase('ready');
      return;
    }
    locked.current = true;
    const feed = () => {
      setPhase('printing');
      timer.current = window.setTimeout(() => {
        setPhase('ready');
        setScene('booth', 1);
        locked.current = false;
      }, PRINT_MS);
    };
    const capture = () => { setPhase('capturing'); timer.current = window.setTimeout(feed, 1150); };
    if (phase === 'ready') {
      setPhase('retracting');
      // The old paper travels back through the same slit before the next feed.
      timer.current = window.setTimeout(capture, RETRACT_MS);
    } else capture();
  };

  return <div className={`photo-booth physical-booth ${busy ? 'printing' : ''}`} data-print-phase={phase}>
    <div className="booth-sign"><span>PHOTO</span><i>nosso jeito de ser</i></div>
    <div className="booth-lights" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i}/>)}</div>
    <div className="booth-curtain">
      <div className="booth-idle" aria-hidden={phase !== 'idle'}><Icon name="heart" size={30}/><p>Três caretas.<br/>Uma tira só nossa.</p><span>toque no botão para imprimir</span></div>
      <div className="booth-paper-channel" inert={phase !== 'ready'} aria-hidden={phase !== 'ready'}>
        <div className="photo-strip physical-photo-strip">
          {photoStory.booth.map(label => <Photo key={label} label={label} sizes="117px" eager showCaption={false} onClick={() => { if (phase === 'ready') openModal({ kind: 'gallery', label }); }}/>)}
          <span>J &amp; J · três jeitos de sorrir</span>
        </div>
      </div>
      <span className="booth-printer-slot" aria-hidden="true"/>
      <span className="booth-printer-lip" aria-hidden="true"/>
    </div>
    <button className="brass-button" disabled={busy} onClick={print}>{phase === 'capturing' ? 'Um sorriso. Mais um…' : phase === 'retracting' ? 'Preparando outra lembrança…' : phase === 'printing' ? 'Imprimindo nossas fotos…' : phase === 'ready' ? 'Imprimir de novo' : 'Preparar nossas fotos'} <Icon name="heart" size={16}/></button>
    <p className="booth-status" aria-live="polite">{phase === 'capturing' ? 'Três poses. Uma lembrança só nossa.' : phase === 'retracting' ? 'A tira volta para a cabine…' : phase === 'printing' ? 'A lembrança está saindo, devagarinho.' : phase === 'ready' ? 'Toque em uma foto para ver de pertinho.' : 'A cabine está pronta para nós.'}</p>
  </div>;
}
