import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useRef, useState } from 'react';
import { album, chapters, pages } from '../../content/album';
import { photoStory } from '../../content/photo-story';
import { calendarElapsed, saoPauloDate } from '../../lib/calendar.mjs';
import { Clock, Flourish, Icon } from '../Art';
import { Photo } from '../Photo';
import type { SceneProps } from './types';
import '../../styles/early-memory.css';
import { FlowerScene, GardenScene } from './BotanicalScenes';

export function Contents({ navigate, compact = false }: { navigate: (index: number) => void; compact?: boolean }) {
  return <div className={`contents ${compact ? 'compact' : ''}`}>
    <div className="quick-links">
      <button onClick={() => navigate(8)}>Nosso começo <span>09</span></button>
      <button onClick={() => navigate(10)}>Nossas fotos <span>11</span></button>
      <button onClick={() => navigate(21)}>Os vídeos <Icon name="play" size={15}/></button>
      <button onClick={() => navigate(3)}>Uma carta <span>04</span></button>
    </div>
    {chapters.map((chapter, i) => <details key={chapter.from} open={compact || undefined}>
      <summary><span className="chapter-number">0{i + 1}</span><span>{chapter.name}<small>{chapter.detail}</small></span><span className="chapter-range">{String(chapter.from + 1).padStart(2, '0')}–{chapter.to + 1}</span></summary>
      <div className="chapter-pages">{pages.slice(chapter.from, chapter.to + 1).map((page, j) => <button key={page[0]} onClick={() => navigate(chapter.from + j)}><span>{String(chapter.from + j + 1).padStart(2, '0')}</span>{page[0]}</button>)}</div>
    </details>)}
  </div>;
}

function TimeScene() {
  const [today, setToday] = useState(() => saoPauloDate());
  useEffect(() => {
    const timer = window.setInterval(() => setToday(saoPauloDate()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const elapsed = calendarElapsed(album.firstMeeting, today);
  return <div className="time-scene"><Clock/>
    <div className="counter" aria-label={`${elapsed.years} anos, ${elapsed.months} meses e ${elapsed.days} dias`}>
      <span><b>{String(elapsed.years).padStart(2, '0')}</b>anos</span><i>·</i>
      <span><b>{String(elapsed.months).padStart(2, '0')}</b>meses</span><i>·</i>
      <span><b>{String(elapsed.days).padStart(2, '0')}</b>dias</span>
    </div><p>{album.counterLabel}</p><span className="date-stamp">28 de agosto de 2026</span>
  </div>;
}

function LetterScene({ progress, setScene, openModal }: SceneProps) {
  const [phase, setPhase] = useState<'rest' | 'opening' | 'reading'>('rest');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const putAway = () => { clearTimeout(timer.current); setPhase('rest'); };
    window.addEventListener('lovestory:overlay-closed', putAway);
    return () => { clearTimeout(timer.current); window.removeEventListener('lovestory:overlay-closed', putAway); };
  }, []);
  const opened = Boolean(progress.scenes.letter);
  const readLetter = () => {
    if (phase !== 'rest') return;
    const reveal = () => { setPhase('reading'); openModal({ kind: 'text', title: 'Uma carta para Mima', text: album.letter }); };
    setPhase('opening');
    setScene('letter', true);
    if (prefersReducedMotion()) reveal();
    else timer.current = window.setTimeout(reveal, 720);
  };
  return <div className="letter-scene"><p className="scene-intro">Tem palavras que merecem<br/>ser guardadas com cuidado.</p>
    <button className={`envelope ${phase !== 'rest' ? 'envelope-open' : ''}`} data-phase={phase} aria-label="Abrir a carta de João para Mima" aria-busy={phase === 'opening'} onClick={readLetter}>
      <span className="letter-paper">Para Mima,<br/><i>com carinho.</i></span><span className="envelope-front"/><span className="envelope-flap"/><span className="wax-seal">J</span>
    </button><span className="handwritten">{phase === 'opening' ? 'Abrindo com carinho…' : opened ? 'a carta continua aqui para você' : 'toque no selo'}</span><Flourish/>
  </div>;
}

function MedallionScene({ progress, setScene, openModal }: SceneProps) {
  const open = Boolean(progress.scenes.medallion);
  return <div className={`moon-scene ${open ? 'medallion-unlatched' : ''}`}><div className="moon" aria-hidden="true"/><div className="medallion-chain"/>
    <button className={`medallion ${open ? 'medallion-open' : ''}`} onClick={() => setScene('medallion', !open)} aria-expanded={open} aria-label={open ? 'Fechar o medalhão' : 'Abrir o medalhão com nossa foto'}>
      <Photo label={photoStory.medallion} sizes="205px" showCaption={false}/><span className="medallion-cover" aria-hidden="true"><span>J &amp; J</span><Icon name="heart" size={25}/></span>
    </button><p className="handwritten">Um retrato nosso,<br/>guardado pertinho.</p>
    <div className="medallion-actions"><button className="text-button light" onClick={() => open ? openModal({ kind: 'gallery', label: photoStory.medallion }) : setScene('medallion', true)}>{open ? 'Ver de pertinho' : 'Abrir o medalhão'} <Icon name="heart" size={16}/></button></div>
    <span className="hint">{open ? 'Toque no medalhão para guardar o retrato.' : 'Toque para abrir o fecho.'}</span>
  </div>;
}

export function EarlyScenes(props: SceneProps) {
  const { number, progress, setScene, openModal, navigate } = props;
  const scenes = progress.scenes;
  switch (number) {
    case 1: return <div className="dedication"><Flourish/><p className="eyebrow">feito de pequenos instantes</p><h3>{album.names.split(' e ')[0]}<em>&</em>{album.names.split(' e ')[1]}</h3><Photo label={photoStory.dedication} sizes="150px" className="dedication-photo" onClick={() => openModal({ kind: 'gallery', label: photoStory.dedication })}/><p className="handwritten">Algumas histórias merecem<br/>um lugar para ficar.</p><button className="text-button" onClick={() => navigate(1)}>Vamos folhear <Icon name="next" size={17}/></button></div>;
    case 2: return <Contents navigate={navigate}/>;
    case 3: return <TimeScene/>;
    case 4: return <LetterScene {...props}/>;
    case 5: return <div className="sky-scene"><div className="constellation" aria-hidden="true"><svg viewBox="0 0 300 240"><path d="m27 140 58-67 67 40 46-79 71 87-47 77-70-85-29 111-96-84" fill="none" stroke="#d9c49b" opacity=".5" strokeWidth="1"/>{[[27, 140], [85, 73], [152, 113], [198, 34], [269, 121], [222, 198], [123, 224]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#f0ddb4"/>)}</svg></div><p className="night-quote">Há um universo inteiro<br/>nos pequenos encontros.</p><button className="light-button" onClick={() => setScene('shooting', Number(scenes.shooting || 0) + 1)}>Fazer um pedido <span>✧</span></button>{Number(scenes.shooting) > 0 && <span key={Number(scenes.shooting)} className="shooting-star"/>}<small className="quiet" aria-live="polite">{Number(scenes.shooting) > 0 ? 'Guarde o pedido. O céu fica com o segredo.' : 'Um céu imaginado para nós.'}</small></div>;
    case 6: return <MedallionScene {...props}/>;
    case 7: return <FlowerScene {...props}/>;
    case 8: return <GardenScene {...props}/>;
    case 9: return <div className={`newspaper ${scenes.news ? 'unfolded' : ''}`}><span className="newspaper-brand">O JORNAL DE NÓS</span><div className="newspaper-edition"><span>edição especial</span><span>28 ago 2026</span></div><h3>O dia em que<br/>a gente se conheceu.</h3><Photo label={photoStory.firstMeeting} sizes="158px" showCaption={false} onClick={() => openModal({ kind: 'gallery', label: photoStory.firstMeeting })}/><p>Primeiro encontro de Jemima e João. Um começo guardado nesta fotografia.</p><div className="newspaper-fold" id="newspaper-extra" aria-hidden={!scenes.news}><div><p className="news-extra">Nem toda notícia precisa fazer barulho. Algumas merecem apenas um lugar especial para ficar.</p><span className="news-signature">o primeiro capítulo de nós dois</span></div></div><button className="text-button" aria-expanded={Boolean(scenes.news)} aria-controls="newspaper-extra" onClick={() => setScene('news', !scenes.news)}>{scenes.news ? 'Dobrar o jornal' : 'Desdobrar a notícia'} <Icon name="book" size={16}/></button></div>;
    case 10: return <div className="beginning-scene first-kiss-scene"><div className="string-line"/><p className="eyebrow">19 de setembro de 2026</p><div className="memory-pinned pinned-kiss"><span className="clip"/><button className={`memory-flip ${scenes.flip1 ? 'flipped' : ''}`} onClick={() => setScene('flip1', !scenes.flip1)} aria-label="Virar lembrança: primeiro beijo" aria-pressed={Boolean(scenes.flip1)}><span className="flip-front" aria-hidden={Boolean(scenes.flip1)}><Photo label={photoStory.firstKiss} sizes="285px" showCaption={false}/><span className="handwritten">O primeiro beijo</span></span><span className="flip-back" aria-hidden={!scenes.flip1}><strong>19 de setembro</strong><p>Bem cedo, o nosso primeiro beijo. Esta foto no carro guarda a lembrança daquele dia.</p><span className="handwritten">o começo de mais um capítulo</span></span></button><button className="small-link" onClick={() => openModal({ kind: 'gallery', label: photoStory.firstKiss })}>Ampliar foto do carro</button></div><p className="hint">Toque na fotografia para virar.</p><button className="text-button" onClick={() => navigate(8)}>Voltar ao primeiro encontro <Icon name="back" size={14}/></button></div>;
    default: return null;
  }
}
