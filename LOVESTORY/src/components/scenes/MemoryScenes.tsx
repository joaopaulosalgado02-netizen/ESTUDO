import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useRef, useState } from 'react';
import { album } from '../../content/album';
import { photoStory, photoTimeline } from '../../content/photo-story';
import { Icon } from '../Art';
import { Photo } from '../Photo';
import type { SceneProps } from './types';
import '../../styles/early-memory.css';
import { PhysicalJar } from './PhysicalJar';
import { Booth } from './Booth';
import { DateWheel } from './DateWheel';
import { MusicBoxScene } from './MechanicalScenes';

const lanternWords = [
  ['presença', 'Tem dias em que só estar perto já é um carinho.'],
  ['cuidado', 'Os pequenos gestos também contam a nossa história.'],
  ['risadas', 'Que a gente guarde espaço para rir de qualquer bobagem.'],
  ['calma', 'Um instante sem pressa, só para respirar e ficar.'],
  ['abraço', 'Um abraço demorado cabe até em uma lembrança.'],
  ['leveza', 'Tem companhia que deixa o dia mais leve.'],
  ['carinho', 'Um pouquinho de carinho para levar com você.'],
  ['nós', 'Duas pessoas, tantas pequenas coisas para guardar.'],
] as const;
function Lanterns({ progress, setScene }: SceneProps) {
  const saved = progress.scenes.lanterns;
  const lit = Array.isArray(saved) ? [...new Set(saved.filter(i => i >= 0 && i < lanternWords.length))] : [];
  const [selected, setSelected] = useState<number | null>(() => lit.length ? lit[lit.length - 1] : null);
  const [shown, setShown] = useState(selected);
  const [fading, setFading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const reveal = (next: number | null) => {
    clearTimeout(timer.current);
    setSelected(next);
    if (prefersReducedMotion()) { setShown(next); setFading(false); return; }
    setFading(true);
    timer.current = window.setTimeout(() => { setShown(next); setFading(false); }, 160);
  };
  return <div className="lantern-scene"><p className="scene-intro">Cada luz, uma palavra<br/>para guardar com a gente.</p>
    <div className="lantern-grid">{lanternWords.map(([word], i) => <div className="lantern-float" key={word} style={{ animationDelay: `${i * -.6}s` }}><button className={`lantern ${lit.includes(i) ? 'lit' : ''} ${selected === i ? 'chosen' : ''}`} aria-label={`${lit.includes(i) ? 'Rever' : 'Acender'} lanterna ${i + 1}`} aria-pressed={selected === i} onClick={() => {
      if (!lit.includes(i)) setScene('lanterns', [...lit, i]);
      reveal(i);
    }}><span className="lantern-string"/><span className="lantern-glow" aria-hidden="true"/><Icon name="heart" size={19}/><span className="lantern-word">{lit.includes(i) ? word : '· · ·'}</span><span className="lantern-base"/></button></div>)}</div>
    <p className={`lantern-phrase ${fading ? 'phrase-changing' : ''}`} aria-live="polite"><span>{shown === null ? 'Toque em uma lanterna para acender um carinho.' : lanternWords[shown][1]}</span></p>
    <p className="handwritten">{lit.length} de {lanternWords.length} lembranças acesas</p>
    <button className="text-button light" onClick={() => { setScene('lanterns', []); reveal(null); }}>Acender outra vez <Icon name="reset" size={14}/></button>
  </div>;
}

function OpenWhen({ progress, setScene, openModal }: SceneProps) {
  const saved = progress.scenes.lettersRead;
  const read = Array.isArray(saved) ? [...new Set(saved.filter(i => i >= 0 && i < album.letters.length))] : [];
  const [opening, setOpening] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const putAway = () => { clearTimeout(timer.current); setOpening(null); setReading(false); };
    window.addEventListener('lovestory:overlay-closed', putAway);
    return () => { clearTimeout(timer.current); window.removeEventListener('lovestory:overlay-closed', putAway); };
  }, []);
  const openLetter = (i: number) => {
    if (opening !== null) return;
    const letter = album.letters[i];
    const reveal = () => {
      setReading(true);
      openModal({ kind: 'text', title: `Quando ${letter.title.toLowerCase()}`, text: `Mima,\n\n${letter.text}\n\nCom carinho,\nJoão` });
    };
    setOpening(i);
    if (!read.includes(i)) setScene('lettersRead', [...read, i]);
    if (prefersReducedMotion()) reveal();
    else timer.current = window.setTimeout(reveal, 660);
  };
  return <div className="open-when"><p className="scene-intro">Um envelope para cada hora.<br/>Abra quando…</p>
    <div className="envelope-grid">{album.letters.map((letter, i) => <button key={letter.title} className={`mini-envelope ${read.includes(i) ? 'read' : ''} ${opening === i ? 'opening' : ''}`} data-phase={opening === i ? reading ? 'reading' : 'opening' : 'rest'} aria-busy={opening === i && !reading} onClick={() => openLetter(i)}>
      <span className="mini-paper" aria-hidden="true">Para Mima ♡</span><span className="mini-flap"/><span className="mini-seal"><Icon name="heart" size={14}/></span><span className="mini-title">{letter.title}</span><small>{read.includes(i) ? 'já tem seu carinho aqui' : 'com carinho, João'}</small>
    </button>)}</div><p className="hint" aria-live="polite">{read.length} de {album.letters.length} cartas abertas</p>
  </div>;
}

export function MemoryScenes(props: SceneProps) {
  const { number, progress, setScene, openModal, navigate } = props;
  const scenes = progress.scenes;
  switch (number) {
    case 11: return <div className="photos-scene"><p className="handwritten">A beleza também mora<br/>nas pequenas coisas.</p><div className="photo-collage curated-collage">{photoStory.collage.map((label, i) => <Photo key={label} label={label} sizes={i === 2 ? '210px' : '145px'} onClick={() => openModal({ kind: 'gallery', label })}/>)}</div><button className="pill-button" onClick={() => openModal({ kind: 'gallery', label: 'F01' })}>Ver nossas 18 fotografias <Icon name="next" size={16}/></button></div>;
    case 12: return <Booth {...props}/>;
    case 13: return <div className="dictionary-scene"><div className="dictionary-book"><span className="eyebrow">nosso pequeno dicionário</span><h3>nós</h3><p className="pronunciation">/nɔs/ · pronome, mas também lugar</p><hr/><p><b>1.</b> Dois jeitos de ver o mundo que encontram uma lembrança em comum.</p><p><b>2.</b> O que fica entre um encontro, uma careta e um pequeno gesto de cuidado.</p><p className="handwritten">Ver também: Jemima e João.</p></div><Photo label={photoStory.dictionary} sizes="128px" className="dictionary-photo" showCaption={false} onClick={() => openModal({ kind: 'gallery', label: photoStory.dictionary })}/><button className="text-button" onClick={() => openModal({ kind: 'text', title: 'Nosso verbete', text: 'Nós\n\nDois jeitos de ver o mundo que encontram uma lembrança em comum.\n\nO que fica entre um encontro, uma careta e um pequeno gesto de cuidado.\n\nVer também: Jemima e João.' })}>Ler de pertinho <span>⌕</span></button></div>;
    case 14: return <div className="timeline-scene text-timeline"><p className="timeline-intro">Alguns dias ganharam uma data.<br/>Todos ganharam um lugar aqui.</p>{photoTimeline.map(({ label, date, title, page }) => <button className="timeline-item" key={label} onClick={() => navigate(page)}><span className="timeline-dot"/><span className="timeline-date">{date || <Icon name="heart" size={13}/>}</span><span><b>{title}</b><small>rever esta lembrança <Icon name="next" size={12}/></small></span></button>)}<span className="timeline-end">e ainda há tantas páginas pela frente.</span></div>;
    case 15: return <DateWheel {...props}/>;
    case 16: return <Lanterns {...props}/>;
    case 17: return <PhysicalJar {...props}/>;
    case 18: return <MusicBoxScene {...props}/>;
    case 19: return <OpenWhen {...props}/>;
    default: return null;
  }
}
