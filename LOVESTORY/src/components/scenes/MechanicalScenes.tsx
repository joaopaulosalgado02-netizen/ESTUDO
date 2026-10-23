import { useEffect, useRef, useState } from 'react';
import { album } from '../../content/album';
import { photoStory } from '../../content/photo-story';
import { prefersReducedMotion } from '../../lib/motion';
import { Flourish, Icon } from '../Art';
import { Photo } from '../Photo';
import type { SceneProps } from './types';
import '../../styles/mechanical-scenes.css';

export function MusicBoxScene({ progress, setScene, playMusic }: SceneProps) {
  const [phase, setPhase] = useState<'closed' | 'winding' | 'opening' | 'open' | 'closing'>(() => progress.scenes.musicBox ? 'open' : 'closed');
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const open = phase === 'opening' || phase === 'open';
  const turn = () => {
    if (busy.current) return;
    const opening = phase === 'closed';
    if (opening) playMusic();
    if (prefersReducedMotion()) { setPhase(opening ? 'open' : 'closed'); setScene('musicBox', opening); return; }
    busy.current = true;
    if (opening) {
      setPhase('winding');
      timers.current.push(window.setTimeout(() => setPhase('opening'), 520));
      timers.current.push(window.setTimeout(() => { setPhase('open'); setScene('musicBox', true); busy.current = false; }, 2200));
    } else {
      setPhase('closing');
      timers.current.push(window.setTimeout(() => { setPhase('closed'); setScene('musicBox', false); busy.current = false; }, 1550));
    }
  };
  return <div className="music-scene tactile-music" data-box-phase={phase}>
    <p className="scene-intro">Tem uma canção<br/>guardada nesta caixinha.</p>
    <button className={`music-box ${open ? 'music-box-open' : ''}`} onClick={turn} disabled={busy.current} aria-expanded={open} aria-label={phase === 'closed' ? 'Girar a manivela e abrir a caixinha' : 'Fechar a caixinha de música'}>
      <span className="music-box-shadow"/>
      <span className="music-box-lid"><span className="music-lid-inside"><Photo label={photoStory.musicBox} sizes="120px" eager showCaption={false}/><span className="music-lid-inscription">a nossa melodia</span></span><span className="music-lid-monogram">J &amp; J</span></span>
      <span className="music-box-interior"><span className="music-cylinder"/><span className="music-pin-row">· · · · · · · · · · · ·</span><span className="gear">✺</span></span>
      <span className="music-dancing-pair" aria-hidden="true"><span>J</span><Icon name="heart" size={18}/><span>J</span></span>
      <span className="music-box-front"><Flourish/><span>nossa canção</span><i/></span>
      <span className="music-crank"><i/></span>
    </button>
    <span className="music-track-label">a trilha da nossa história</span><h3>{album.music.title}</h3><p className="music-track-artist">{album.music.artist}</p>
    <p className="hint" aria-live="polite">{phase === 'winding' ? 'Uma voltinha na manivela…' : phase === 'opening' ? 'A tampa se abre. A nossa canção começa.' : phase === 'closing' ? 'Guardando a melodia com cuidado…' : open ? 'A canção continua no player. Toque para guardar a caixinha.' : 'Toque na caixinha para girar a manivela.'}</p>
  </div>;
}

type CameraPhase = 'idle' | 'capturing' | 'printing' | 'ready' | 'retracting';
export function InstantCameraScene({ progress, setScene, openModal }: SceneProps) {
  const [phase, setPhase] = useState<CameraPhase>(() => Number(progress.scenes.instant || 0) ? 'ready' : 'idle');
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const reveal = () => {
    if (busy.current) return;
    if (prefersReducedMotion()) { setPhase('ready'); setScene('instant', 1); return; }
    busy.current = true;
    const shoot = () => {
      setPhase('capturing');
      timers.current.push(window.setTimeout(() => setPhase('printing'), 650));
      timers.current.push(window.setTimeout(() => {
        const paper = output.current, scroll = paper?.closest<HTMLElement>('.page-scroll');
        if (paper && scroll) { const delta = paper.getBoundingClientRect().bottom + 14 - scroll.getBoundingClientRect().bottom; if (delta > 0) scroll.scrollBy({ top: delta, behavior: 'smooth' }); }
      }, 2350));
      timers.current.push(window.setTimeout(() => { setPhase('ready'); setScene('instant', 1); busy.current = false; }, 4900));
    };
    if (phase === 'ready') { setPhase('retracting'); timers.current.push(window.setTimeout(shoot, 780)); }
    else shoot();
  };
  const working = phase !== 'idle' && phase !== 'ready';
  return <div className={`instant-scene tactile-camera ${working ? 'developing' : ''}`} data-camera-phase={phase} data-gesture="true">
    <p className="scene-intro">Um instante nosso.<br/>Revelado sem pressa.</p>
    <div className="instant-camera-stage"><div className="camera-machine">
      <button className="art-button camera-button" disabled={working} onClick={reveal} aria-label="Disparar a câmera de lembranças">
        <svg className="camera-art" viewBox="0 0 300 230" aria-hidden="true"><defs><linearGradient id="camera-shell" x2=".85" y2="1"><stop stopColor="#f2e7d1"/><stop offset="1" stopColor="#bba88f"/></linearGradient></defs><ellipse cx="150" cy="215" rx="115" ry="9" fill="#64462d22"/><path d="m65 38 20-23h132l20 23 33 153q1 19-18 19H48q-18 0-16-19Z" fill="url(#camera-shell)" stroke="#9e886b" strokeWidth="2"/><path d="M64 39h172l-7 22H70Z" fill="#a58e75"/><path d="M45 137h211l13 54H33Z" fill="#734252"/><path d="M56 147h189M52 153h198M49 159h204" stroke="#a9748070"/><rect x="73" y="57" width="63" height="29" rx="3" fill="#dedbc2" stroke="#9b9b86"/><path d="M79 62h50m-50 5h50m-50 5h50m-50 5h50" stroke="#b5b49d"/><rect x="194" y="61" width="30" height="22" rx="3" fill="#3d3840" stroke="#bda47f" strokeWidth="2"/><circle cx="151" cy="114" r="47" fill="#c0a67d" stroke="#957b5a" strokeWidth="2"/><circle cx="151" cy="114" r="39" fill="#493e3d" stroke="#ddc8a0" strokeWidth="2"/><circle cx="151" cy="114" r="29" fill="#26313a" stroke="#777f7a" strokeWidth="2"/><circle cx="144" cy="106" r="9" fill="#9bb0ad" opacity=".45"/><circle cx="240" cy="112" r="9" fill="#a25956" stroke="#d7b59b"/><path d="m241 105 3 2" stroke="#f2c7ac" strokeWidth="2"/><rect x="78" y="192" width="144" height="8" rx="3" fill="#261d24" stroke="#b29b79"/><text x="150" y="177" fill="#e7d2ae" textAnchor="middle" fontFamily="Georgia" fontSize="11" letterSpacing="4">INSTANTE</text></svg>
      </button>
      <span className="camera-flash" aria-hidden="true"/>
      <div className="instant-output" ref={output} inert={phase !== 'ready'} aria-hidden={phase !== 'ready'}><div className={`instant-print ${phase === 'ready' ? 'print-ready' : phase === 'retracting' ? 'print-retracting' : 'print-developing'}`}><Photo label={photoStory.instant} sizes="166px" eager onClick={() => { if (phase === 'ready') openModal({ kind: 'gallery', label: photoStory.instant }); }}/></div></div>
      <span className="camera-feed-lip" aria-hidden="true"/>
    </div></div>
    <div className="instant-status" role="status">{phase === 'capturing' ? 'Sorria. Este instante é nosso.' : phase === 'printing' ? 'O papel desce. A lembrança ganha cor.' : phase === 'retracting' ? 'Recolhendo a fotografia pela mesma fenda…' : phase === 'ready' ? 'Prontinha. Toque na foto para ver de pertinho.' : 'Toque no disparador para revelar a fotografia.'}</div>
    <button className="text-button" disabled={working} onClick={reveal}>{working ? 'Revelando…' : phase === 'ready' ? 'Revelar de novo' : 'Revelar uma lembrança'} <Icon name={phase === 'ready' ? 'reset' : 'heart'} size={15}/></button>
  </div>;
}
