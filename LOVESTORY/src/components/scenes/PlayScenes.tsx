import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { album } from '../../content/album';
import { photoStory } from '../../content/photo-story';
import { Icon } from '../Art';
import { Photo, videos } from '../Photo';
import { Arcade, Puzzle, Scratch, Signature } from './Games';
import type { SceneProps } from './types';
import { InstantCameraScene } from './MechanicalScenes';
import { KeepsakeScene } from './KeepsakeScene';

const lightNotes = [
  { title: 'Companhia', text: 'Os pequenos momentos ficam maiores quando a gente divide.', symbol: '✦' },
  { title: 'Cuidado', text: 'Um carinho mora também nos gestos mais simples.', symbol: '♡' },
  { title: 'Risadas', text: 'Espaço reservado para as nossas próximas caretas.', symbol: '☼' },
  { title: 'Calma', text: 'Um instante de cada vez. A nossa história pode ir sem pressa.', symbol: '☾' },
];

function Flashlight({ progress, setScene }: SceneProps) {
  const board = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef<number | null>(null);
  const found = Array.isArray(progress.scenes.found) ? progress.scenes.found.filter(index => index >= 0 && index < 4) : [];
  const foundRef = useRef(found); foundRef.current = found;
  const on = Boolean(progress.scenes.fullLight);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function reveal(index: number) {
    if (foundRef.current.includes(index)) return;
    const next = [...foundRef.current, index]; foundRef.current = next;
    setScene('found', next);
  }

  function moveLight(x: number, y: number, travel = false) {
    cancelAnimationFrame(frame.current);
    if (beam.current) beam.current.style.transition = travel ? 'transform .48s cubic-bezier(.2,.75,.25,1), opacity .8s' : 'opacity .8s';
    frame.current = requestAnimationFrame(() => {
      if (beam.current) beam.current.style.transform = 'translate3d(' + (x - 84) + 'px,' + (y - 84) + 'px,0)';
    });
  }

  function explore(event: PointerEvent<HTMLDivElement>) {
    if (on || (event.pointerType !== 'mouse' && pointer.current !== event.pointerId)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    moveLight(x, y);
    reveal((y > rect.height / 2 ? 2 : 0) + (x > rect.width / 2 ? 1 : 0));
  }

  function centerOn(index: number) {
    const element = board.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    moveLight(rect.width * (index % 2 ? .74 : .26), rect.height * (index < 2 ? .27 : .73), true);
    reveal(index);
  }

  return <div className="flashlight-scene" data-gesture="true">
    <p className="scene-intro">Há coisas bonitas que aparecem<br />quando a gente olha com carinho.</p>
    <div className={'flashlight-board ' + (on ? 'all-lit' : '')} ref={board}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        pointer.current = event.pointerId;
        // Capture on the board keeps a touch gesture continuous without interrupting the note buttons.
        if (!(event.target as HTMLElement).closest('button')) event.currentTarget.setPointerCapture(event.pointerId);
        explore(event);
      }} onPointerMove={explore}
      onPointerUp={event => {
        pointer.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }} onPointerCancel={() => { pointer.current = null; }}>
      <div className="light-notes">{lightNotes.map((note, index) => <button key={note.title}
        className={found.includes(index) ? 'light-note found' : 'light-note'}
        aria-label={'Revelar carinho: ' + note.title} aria-pressed={found.includes(index)}
        onFocus={() => centerOn(index)} onClick={() => centerOn(index)}>
        <span className="light-note-symbol" aria-hidden="true">{note.symbol}</span>
        <strong>{note.title}</strong><span>{note.text}</span>
        <i aria-hidden="true">{found.includes(index) ? '✓' : '·'}</i>
      </button>)}</div>
      <div className="flashlight-shadow" ref={beam} aria-hidden="true" />
      <span className="light-board-star" aria-hidden="true">✧</span>
    </div>
    <p className="handwritten">{on ? 'Olha quanta coisa bonita ficou.' : 'Passe o dedo e deixe a luz encontrar.'}</p>
    <button className="light-button" aria-pressed={on} onClick={() => {
      setScene('fullLight', !on);
      if (!on) { foundRef.current = [0, 1, 2, 3]; setScene('found', [0, 1, 2, 3]); }
    }}>{on ? 'Apagar a luz' : 'Acender a cena inteira'}</button>
    <span className="hint" role="status">{found.length} de 4 carinhos encontrados</span>
  </div>;
}

function Cinema({ openModal }: SceneProps) {
  return <div className="cinema-scene">
    <div className="cinema-sign">CINEMA DE NÓS <span>sessão particular · 10 de outubro</span></div>
    <p className="handwritten">O nosso primeiro dia de máscara.<br />Com direito a caretas e replay.</p>
    <div className="cinema-tickets">{videos.map((video, index) => <button className="cinema-ticket" key={video.id}
      aria-label={'Assistir lembrança ' + (index + 1) + ', ' + Math.round(video.durationSeconds || 0) + ' segundos'}
      onClick={() => openModal({ kind: 'video', index })}>
      <span className="cinema-poster"><img src={import.meta.env.BASE_URL + 'media/posters/' + (index + 1) + '.jpg'} alt="" loading="lazy" decoding="async" width={video.width} height={video.height} /><span className="screen-play"><Icon name="play" size={27} /></span><span className="film-duration">{Math.round(video.durationSeconds || 0)}s</span></span>
      <span className="cinema-ticket-label"><small>ADMITIR DOIS</small><strong>Lembrança 0{index + 1}</strong><span>Toque para assistir <Icon name="play" size={12} /></span></span>
    </button>)}</div>
    <div className="cinema-footer"><span aria-hidden="true">✦</span><span>Som, caretas e um pouquinho de nós.</span><span aria-hidden="true">✦</span></div>
    <span className="hint">Os vídeos abrem com controle de som e pausa.</span>
  </div>;
}

function Plans({ progress, setScene }: SceneProps) {
  const plans = Array.isArray(progress.scenes.plans) ? progress.scenes.plans : [];
  const paths = [
    'M5 9h14l-2 10H7ZM8 4v3m4-4v4m4-3v3M9 13h6',
    'M4 5h16v14H4ZM4 9h16M8 5v4m5-4v4m5-4v4m-8 3 5 3-5 3Z',
    'M4 19h16M6 19l6-9 6 9M12 3v3M5 6l2 2m12-2-2 2M2 12h3m14 0h3',
    'M4 7h16v12H4ZM4 7l8 7 8-7M8 4h8',
  ];
  return <div className="plans-scene" data-gesture="true">
    <p className="scene-intro">Ideias para os dias que vêm.<br />A gente escolhe, sem pressa.</p>
    <div className="plans-board">{album.plans.map((plan, index) => <button className={'plan-note ' + (plans.includes(index) ? 'plan-done' : '')} key={plan} aria-pressed={plans.includes(index)}
      onClick={() => setScene('plans', plans.includes(index) ? plans.filter(value => value !== index) : [...plans, index])}>
      <span className="plan-pin" /><svg className="plan-sketch" width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={paths[index]} /></svg>
      <strong>{plan}</strong><small className="state-copy"><span className={plans.includes(index) ? '' : 'copy-visible'} aria-hidden={plans.includes(index)}>uma ideia para nós</span><span className={plans.includes(index) ? 'copy-visible' : ''} aria-hidden={!plans.includes(index)}>já virou lembrança</span></small>
      <span className="plan-check" aria-hidden="true">✓</span>
    </button>)}</div>
    <p className="plans-count" role="status">{plans.length ? plans.length + ' de ' + album.plans.length + ' ideias já viraram lembrança.' : 'Quatro ideias. Muitos dias bonitos pela frente.'}</p>
    <p className="hint">Toque para marcar. Toque outra vez para desfazer.</p>
  </div>;
}

const VOUCHER_COST = 3;

function Vouchers({ progress, update, navigate }: SceneProps) {
  const [chosen, setChosen] = useState<number | null>(null);
  return <div className="vouchers-scene" data-gesture="true">
    <div className="shop-awning" aria-hidden="true" />
    <p className="voucher-balance"><Icon name="heart" size={18} /><b key={progress.points}>{progress.points}</b> pontos de carinho <small>{progress.vouchers.length} {progress.vouchers.length === 1 ? 'vale escolhido' : 'vales escolhidos'}</small></p>
    <div className="voucher-list">{album.vouchers.map((voucher, index) => {
      const redeemed = progress.vouchers.includes(index);
      return <button className={'voucher ' + (redeemed ? 'redeemed' : '')} key={voucher} disabled={redeemed || progress.points < VOUCHER_COST}
        onClick={() => {
          if (progress.points < VOUCHER_COST || redeemed) return;
          update(previous => previous.points < VOUCHER_COST || previous.vouchers.includes(index) ? previous : {
            ...previous, points: previous.points - VOUCHER_COST, vouchers: [...previous.vouchers, index],
          });
          setChosen(index);
        }}>
        <span>VALE 0{index + 1}<b>{voucher}</b><small>{redeemed ? 'guardado com carinho' : progress.points < VOUCHER_COST ? 'Faltam ' + (VOUCHER_COST - progress.points) + ' pontos para escolher' : '3 pontos · escolher este carinho'}</small></span>
        <span className="voucher-seal"><span className="voucher-heart" aria-hidden="true"><Icon name="heart" size={26} /></span><span className="voucher-stamp" aria-label={redeemed ? 'Vale escolhido' : undefined} aria-hidden={!redeemed}>✓</span></span>
      </button>;
    })}</div>
    <div className={'voucher-confirmation ' + (chosen !== null ? 'visible' : '')} key={'chosen-' + chosen} role="status">{chosen !== null ? 'Vale guardado! 3 pontos trocados por um carinho.' : 'Cada vale custa 3 pontos do seu saldo.'}</div>
    <p className="handwritten">Um vale simbólico,<br />para combinar entre nós.</p>
    <button className="text-button" onClick={() => navigate(26)}>Brincar e ganhar pontos <Icon name="next" size={16} /></button>
  </div>;
}

export function PlayScenes(props: SceneProps) {
  switch (props.number) {
    case 20: return <Puzzle {...props} />;
    case 21: return <Scratch {...props} />;
    case 22: return <Cinema {...props} />;
    case 23: return <Flashlight {...props} />;
    case 24: return <InstantCameraScene {...props} />;
    case 25: return <div className="postcards-scene"><div className="postmark" aria-hidden="true">MEMÓRIAS<br /><span>J &amp; J</span><br />edição nossa</div><p className="scene-intro">Alguns lugares ficam na memória<br />por causa da companhia.</p>{photoStory.postcards.map(({ label, title }, index) => <button className="postcard" key={label} onClick={() => props.openModal({ kind: 'gallery', label })} style={{ '--tilt': (index - 1) * 2 + 'deg', '--postcard-index': index } as CSSProperties}><Photo label={label} showCaption={false} /><span><i>Um lugar na memória</i><b>{title}</b><small>com você, João</small></span><span className="postcard-arrow" aria-hidden="true"><Icon name="next" size={13} /></span></button>)}</div>;
    case 26: return <Plans {...props} />;
    case 27: return <Arcade {...props} />;
    case 28: return <Vouchers {...props} />;
    case 29: return <Signature {...props} />;
    case 30: return <KeepsakeScene {...props} />;
    default: return null;
  }
}

