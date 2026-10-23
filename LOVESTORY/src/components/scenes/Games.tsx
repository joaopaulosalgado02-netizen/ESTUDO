import { prefersReducedMotion } from '../../lib/motion';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { album } from '../../content/album';
import { photoStory } from '../../content/photo-story';
import { photoByLabel } from '../Photo';
import { Icon } from '../Art';
import type { SceneProps } from './types';
import '../../styles/play-games.css';

const START_PUZZLE = [3, 0, 7, 1, 8, 5, 6, 2, 4];
type Drag = { index: number; pointer: number; x: number; y: number; moved: boolean; element: HTMLButtonElement };

export function Puzzle({ progress, setScene, openModal }: SceneProps) {
  const saved = progress.scenes.puzzle;
  const pieces = Array.isArray(saved) && saved.length === 9 && new Set(saved).size === 9
    && saved.every(piece => Number.isInteger(piece) && piece >= 0 && piece < 9) ? saved : START_PUZZLE;
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const dragFrame = useRef(0);
  const suppressClick = useRef(false);
  const previousPieces = useRef(pieces);
  const releasedPiece = useRef<{ piece: number; x: number; y: number } | null>(null);
  const pieceRects = useRef(new Map<number, DOMRect>());
  const pieceAnimations = useRef<Animation[]>([]);
  const completed = pieces.every((piece, index) => piece === index);
  const photo = photoByLabel(photoStory.puzzle);
  const fitted = pieces.filter((piece, index) => piece === index).length;

  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);
  // Keep each physical piece in the same visual place while its grid slot changes.
  useLayoutEffect(() => {
    const element = board.current;
    const previous = previousPieces.current;
    previousPieces.current = pieces;
    if (!element || previous === pieces) return;
    pieceAnimations.current.forEach(animation => animation.cancel());
    pieceAnimations.current = [];
    const rect = element.getBoundingClientRect();
    if (!prefersReducedMotion()) {
      element.querySelectorAll<HTMLButtonElement>('button').forEach((button, index) => {
        const piece = pieces[index], before = previous.indexOf(piece);
        const released = releasedPiece.current?.piece === piece ? releasedPiece.current : null;
        const visual = pieceRects.current.get(piece);
        const x = released ? released.x - rect.left - index % 3 * rect.width / 3 : visual ? visual.left - rect.left - index % 3 * rect.width / 3 : (before % 3 - index % 3) * rect.width / 3;
        const y = released ? released.y - rect.top - Math.floor(index / 3) * rect.height / 3 : visual ? visual.top - rect.top - Math.floor(index / 3) * rect.height / 3 : (Math.floor(before / 3) - Math.floor(index / 3)) * rect.height / 3;
        if (!x && !y) return;
        const animation = button.animate([
          { transform: `translate3d(${x}px,${y}px,0)`, filter: 'brightness(1.12)' },
          { transform: 'translate3d(0,0,0)', filter: 'brightness(1)' },
        ], { duration: 520, easing: 'cubic-bezier(.18,.75,.22,1)' });
        pieceAnimations.current.push(animation);
      });
    }
    releasedPiece.current = null;
    pieceRects.current.clear();
    return () => pieceAnimations.current.forEach(animation => animation.cancel());
  }, [pieces]);

  function capturePiecePositions() {
    board.current?.querySelectorAll<HTMLButtonElement>('button').forEach((button, index) => {
      pieceRects.current.set(pieces[index], button.getBoundingClientRect());
    });
  }

  function swap(from: number, to: number) {
    setSelected(null);
    if (from === to) return;
    capturePiecePositions();
    const next = [...pieces];
    [next[from], next[to]] = [next[to], next[from]];
    setScene('puzzle', next);
  }

  function stopDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    cancelAnimationFrame(dragFrame.current);
    const releaseRect = start.element.getBoundingClientRect();
    releasedPiece.current = { piece: pieces[start.index], x: releaseRect.left, y: releaseRect.top };
    start.element.style.removeProperty('--drag-x');
    start.element.style.removeProperty('--drag-y');
    drag.current = null;
    setDragging(null);
    suppressClick.current = start.moved;
    if (start.element.hasPointerCapture(event.pointerId)) start.element.releasePointerCapture(event.pointerId);
    function returnToSlot() {
      if (start?.moved && !prefersReducedMotion()) {
        const resting = start.element.getBoundingClientRect();
        start.element.animate([{ transform: `translate(${releaseRect.left - resting.left}px,${releaseRect.top - resting.top}px)` }, { transform: 'translate(0,0)' }], { duration: 320, easing: 'ease-out' });
      }
      releasedPiece.current = null;
    }
    if (cancelled || !start.moved || !board.current) {
      returnToSlot();
      return;
    }
    const rect = board.current.getBoundingClientRect();
    const column = Math.floor((event.clientX - rect.left) / rect.width * 3);
    const row = Math.floor((event.clientY - rect.top) / rect.height * 3);
    if (column >= 0 && column < 3 && row >= 0 && row < 3 && row * 3 + column !== start.index) swap(start.index, row * 3 + column);
    else returnToSlot();
  }

  return <div className="puzzle-scene" data-gesture="true">
    <p className="scene-intro">Uma lembrança se encontra<br />um pedacinho de cada vez.</p>
    <div className={'puzzle-board ' + (completed ? 'completed' : '')} ref={board}
      style={{ aspectRatio: photo.width + '/' + photo.height }} aria-label="Quebra-cabeça de nove peças">
      {pieces.map((piece, index) => <button key={piece}
        className={[selected === index ? 'selected' : '', dragging === index ? 'puzzle-dragging' : '', piece === index ? 'puzzle-fitted' : ''].join(' ')}
        aria-label={'Peça ' + (piece + 1) + ', posição ' + (index + 1) + (piece === index ? ', no lugar certo' : '')}
        aria-pressed={selected === index}
        style={{
          backgroundImage: 'url(' + import.meta.env.BASE_URL + photo.webFile + ')',
          backgroundPosition: (piece % 3 * 50) + '% ' + (Math.floor(piece / 3) * 50) + '%',
          left: (index % 3 * 100 / 3) + '%', top: (Math.floor(index / 3) * 100 / 3) + '%',
        } as CSSProperties}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || completed) return;
          suppressClick.current = false;
          drag.current = { index, pointer: event.pointerId, x: event.clientX, y: event.clientY, moved: false, element: event.currentTarget };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const start = drag.current;
          if (!start || start.pointer !== event.pointerId) return;
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (!start.moved && Math.hypot(dx, dy) < 8) return;
          if (!start.moved) { start.moved = true; setDragging(start.index); setSelected(null); }
          cancelAnimationFrame(dragFrame.current);
          dragFrame.current = requestAnimationFrame(() => {
            start.element.style.setProperty('--drag-x', dx + 'px');
            start.element.style.setProperty('--drag-y', dy + 'px');
          });
        }}
        onPointerUp={event => stopDrag(event)} onPointerCancel={event => stopDrag(event, true)}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          if (completed) return;
          if (selected === null) setSelected(index);
          else swap(selected, index);
        }}
        onKeyDown={event => {
          const offset = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[event.key];
          if (offset === undefined) return;
          event.preventDefault(); event.stopPropagation();
          board.current?.querySelectorAll<HTMLButtonElement>('button')[(index + offset + 9) % 9]?.focus();
        }}><span>{piece + 1}</span></button>)}
      {completed && <span className="puzzle-complete-seal" aria-hidden="true"><Icon name="heart" size={20} /></span>}
    </div>
    <span className="puzzle-progress">{fitted} de 9 peças no lugar</span>
    <p className="handwritten" aria-live="polite">{completed ? 'Todos os pedacinhos de nós, juntos.' : selected === null ? 'Arraste, ou toque em duas peças para trocar.' : 'Agora escolha com qual peça trocar.'}</p>
    <div className="button-row">
      <button className="small-link" onClick={() => openModal({ kind: 'gallery', label: photoStory.puzzle })}>Ver foto</button>
      <button className="small-link puzzle-complete-action" disabled={completed} aria-hidden={completed} onClick={() => { capturePiecePositions(); setScene('puzzle', [0, 1, 2, 3, 4, 5, 6, 7, 8]); setSelected(null); }}>Completar para mim</button>
    </div>
    <button className="text-button" onClick={() => { capturePiecePositions(); setScene('puzzle', [...START_PUZZLE]); setSelected(null); }}>Misturar de novo <Icon name="reset" size={14} /></button>
  </div>;
}

type ScratchPoint = { x: number; y: number; start: boolean };
const SCRATCH_COLUMNS = 30, SCRATCH_ROWS = 22;

export function Scratch({ progress, setScene }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const pointer = useRef<number | null>(null);
  const previousPoint = useRef<ScratchPoint | null>(null);
  const strokes = useRef<ScratchPoint[]>([]);
  const coverage = useRef(new Uint8Array(SCRATCH_COLUMNS * SCRATCH_ROWS));
  const cleared = useRef(0);
  const finishing = useRef(false);
  const revealed = Boolean(progress.scenes.scratch);

  useEffect(() => {
    finishing.current = revealed;
    if (revealed) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const paint = () => {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      if (!width || !height) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.globalCompositeOperation = 'source-over';
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ddc99f'); gradient.addColorStop(.48, '#b19770'); gradient.addColorStop(1, '#e4cfaa');
      context.fillStyle = gradient; context.fillRect(0, 0, width, height);
      context.strokeStyle = '#f7e8bd55'; context.lineWidth = 1;
      for (let line = -height; line < width; line += 10) {
        context.beginPath(); context.moveTo(line, 0); context.lineTo(line + height, height); context.stroke();
      }
      context.fillStyle = '#604a37'; context.textAlign = 'center';
      context.font = 'italic 21px Georgia'; context.fillText('Raspe um pouquinho…', width / 2, height / 2 - 3);
      context.font = '12px Georgia'; context.fillText('tem um carinho aqui', width / 2, height / 2 + 25);
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 46; context.lineCap = 'round'; context.lineJoin = 'round';
      context.fillStyle = '#000'; context.strokeStyle = '#000';
      let previous: ScratchPoint | null = null;
      for (const point of strokes.current) {
        if (point.start || !previous) {
          context.beginPath(); context.arc(point.x * width, point.y * height, 23, 0, Math.PI * 2); context.fill();
        } else {
          context.beginPath(); context.moveTo(previous.x * width, previous.y * height); context.lineTo(point.x * width, point.y * height); context.stroke();
        }
        previous = point;
      }
    };
    paint();
    const observer = new ResizeObserver(paint); observer.observe(canvas);
    return () => observer.disconnect();
  }, [revealed]);

  function scratch(event: PointerEvent<HTMLCanvasElement>, start = false) {
    if (pointer.current !== event.pointerId || finishing.current) return;
    const canvas = event.currentTarget, context = canvas.getContext('2d');
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), start };
    const previous = previousPoint.current || point;
    const x = point.x * rect.width, y = point.y * rect.height;
    const px = previous.x * rect.width, py = previous.y * rect.height;
    context.beginPath();
    if (start) { context.arc(x, y, 23, 0, Math.PI * 2); context.fill(); }
    else { context.moveTo(px, py); context.lineTo(x, y); context.stroke(); }
    strokes.current.push(point); previousPoint.current = point;

    // A small logical grid measures coverage without reading canvas pixels back from the GPU.
    const minColumn = Math.max(0, Math.floor((Math.min(x, px) - 23) / rect.width * SCRATCH_COLUMNS));
    const maxColumn = Math.min(SCRATCH_COLUMNS - 1, Math.floor((Math.max(x, px) + 23) / rect.width * SCRATCH_COLUMNS));
    const minRow = Math.max(0, Math.floor((Math.min(y, py) - 23) / rect.height * SCRATCH_ROWS));
    const maxRow = Math.min(SCRATCH_ROWS - 1, Math.floor((Math.max(y, py) + 23) / rect.height * SCRATCH_ROWS));
    const dx = x - px, dy = y - py, distance = dx * dx + dy * dy;
    for (let row = minRow; row <= maxRow; row++) for (let column = minColumn; column <= maxColumn; column++) {
      const index = row * SCRATCH_COLUMNS + column;
      if (coverage.current[index]) continue;
      const cx = (column + .5) / SCRATCH_COLUMNS * rect.width, cy = (row + .5) / SCRATCH_ROWS * rect.height;
      const t = distance ? Math.max(0, Math.min(1, ((cx - px) * dx + (cy - py) * dy) / distance)) : 0;
      if ((cx - px - dx * t) ** 2 + (cy - py - dy * t) ** 2 <= 23 ** 2) {
        coverage.current[index] = 1; cleared.current++;
      }
    }
    const fraction = cleared.current / coverage.current.length;
    if (progressRef.current) progressRef.current.value = Math.min(100, Math.round(fraction / .52 * 100));
    if (fraction >= .52) { finishing.current = true; pointer.current = null; setScene('scratch', true); }
  }

  return <div className={'scratch-scene ' + (revealed ? 'scratch-revealed' : '')} data-gesture="true">
    <div className="scratch-ticket">
      <span className="eyebrow">uma surpresa pequenininha</span>
      <div className="scratch-area">
        <div className="scratch-message"><Icon name="heart" size={33} /><p>Vale um abraço<br />bem demorado.</p><span>para Mima, com carinho</span></div>
        <canvas ref={canvasRef} aria-hidden={revealed} aria-label="Raspe com o dedo para revelar um carinho"
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); scratch(event, true);
          }} onPointerMove={event => scratch(event)}
          onPointerUp={event => {
            if (pointer.current !== event.pointerId) return;
            pointer.current = null; previousPoint.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }} onPointerCancel={() => { pointer.current = null; previousPoint.current = null; }} />
      </div>
      <p className="handwritten" aria-live="polite">{revealed ? 'Prontinho. Pode guardar esse.' : 'A surpresa está logo aí.'}</p>
    </div>
    <progress ref={progressRef} className="scratch-progress" value={revealed ? 100 : 0} max={100} aria-hidden={revealed} aria-label="Quanto falta para revelar o carinho" />
    <button className="pill-button" onClick={() => {
      strokes.current = []; coverage.current.fill(0); cleared.current = 0; previousPoint.current = null; pointer.current = null;
      setScene('scratch', !revealed);
    }}>{revealed ? 'Esconder de novo' : 'Revelar o carinho'}</button>
    <span className="hint scratch-hint" aria-hidden={revealed}>Passe o dedo pela área dourada ou use o botão.</span>
  </div>;
}

type GameMode = 'hearts' | 'timing';
type GamePhase = 'ready' | 'playing' | 'paused' | 'done';

export function Arcade({ progress, update }: SceneProps) {
  const [mode, setMode] = useState<GameMode>('hearts');
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(12);
  const [target, setTarget] = useState(4);
  const [caught, setCaught] = useState<{ index: number; sequence: number } | null>(null);
  const [screen, setScreen] = useState<{ phase: GamePhase; mode: GameMode }>({ phase: 'ready', mode: 'hearts' });
  const screenContent = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  const elapsedBeforePause = useRef(0);
  const scoreRef = useRef(0);
  const meter = useRef(0);
  const phaseRef = useRef<GamePhase>('ready');
  const awarded = useRef(false);
  const updateRef = useRef(update); updateRef.current = update;

  useEffect(() => {
    if (screen.phase === phase && screen.mode === mode) return;
    let active = true;
    const element = screenContent.current;
    if (!element || prefersReducedMotion()) {
      setScreen({ phase, mode });
      return;
    }
    const animation = element.animate([
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(-10px) scale(.97)' },
    ], { duration: 160, easing: 'ease-in', fill: 'forwards' });
    animation.finished.then(() => { if (active) setScreen({ phase, mode }); }).catch(() => {});
    return () => { active = false; animation.cancel(); };
  }, [phase, mode, screen]);

  useLayoutEffect(() => {
    const element = screenContent.current;
    if (!element || prefersReducedMotion()) return;
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(14px) scale(.97)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 380, easing: 'cubic-bezier(.2,.75,.25,1)' });
    return () => animation.cancel();
  }, [screen]);

  function finish(points: number) {
    if (awarded.current || phaseRef.current !== 'playing') return;
    awarded.current = true; phaseRef.current = 'done'; setPhase('done'); setScore(points);
    updateRef.current(previous => ({ ...previous, points: previous.points + points, scenes: { ...previous.scenes, lastGame: points } }));
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    let frame = 0, lastSecond = -1;
    const reduceMotion = prefersReducedMotion();
    function tick(now: number) {
      const elapsed = elapsedBeforePause.current + now - start.current;
      const duration = mode === 'hearts' ? 12000 : 10000;
      if (elapsed >= duration) { finish(mode === 'hearts' ? scoreRef.current : 0); return; }
      const remaining = Math.ceil((duration - elapsed) / 1000);
      if (remaining !== lastSecond) { lastSecond = remaining; setSeconds(remaining); }
      if (mode === 'timing') {
        meter.current = (Math.sin(elapsed / (reduceMotion ? 520 : 350) - Math.PI / 2) + 1) * 50;
        if (meterRef.current) meterRef.current.style.transform = 'translate3d(' + meter.current + '%,0,0)';
      }
      frame = requestAnimationFrame(tick);
    }
    const pauseWhenHidden = () => {
      if (!document.hidden || phaseRef.current !== 'playing') return;
      elapsedBeforePause.current += performance.now() - start.current;
      phaseRef.current = 'paused'; setPhase('paused'); cancelAnimationFrame(frame);
    };
    frame = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', pauseWhenHidden); };
  }, [phase, mode]);

  function begin() {
    scoreRef.current = 0; awarded.current = false; elapsedBeforePause.current = 0; meter.current = 0;
    setScore(0); setCaught(null); setSeconds(mode === 'hearts' ? 12 : 10); setTarget(Math.floor(Math.random() * 9));
    start.current = performance.now(); phaseRef.current = 'playing'; setPhase('playing');
  }

  return <div className="arcade-scene" data-gesture="true">
    <div className="arcade-marquee">PARQUE A DOIS <span>pequenas alegrias</span></div>
    <div className="game-tabs">{(['hearts', 'timing'] as const).map(value => <button key={value} aria-pressed={mode === value}
      disabled={phase === 'playing' || phase === 'paused'} onClick={() => { setMode(value); phaseRef.current = 'ready'; setPhase('ready'); }}>
      {value === 'hearts' ? 'Pegue corações' : 'No ponto certo'}</button>)}</div>
    <div className={'arcade-screen game-' + screen.phase}>
      <div className="game-screen-content" ref={screenContent}>
      {screen.phase === 'ready' ? <><Icon name="heart" size={45} /><p>{screen.mode === 'hearts' ? 'Toque no coração que aparecer. Você tem 12 segundos.' : 'Pare o marcador perto do centro. Você tem 10 segundos.'}</p><small className="game-instruction">{screen.mode === 'hearts' ? 'Cada coração vale 1 ponto.' : 'Quanto mais perto, mais carinho: até 10 pontos.'}</small></>
        : screen.phase === 'paused' ? <><Icon name="play" size={35} /><p>Sua rodada está em pausa.<br />Continue quando quiser.</p><button className="brass-button" onClick={() => { start.current = performance.now(); phaseRef.current = 'playing'; setPhase('playing'); }}>Continuar rodada</button></>
          : screen.phase === 'done' ? <><span className="game-score">{score}</span><p>{score === 1 ? 'ponto de carinho nesta rodada' : 'pontos de carinho nesta rodada'}</p><span className="handwritten">{score ? 'Carinho guardado no seu saldo.' : 'Vamos mais uma vez?'}</span></>
            : screen.mode === 'hearts' ? <><div className="game-info"><span>{seconds}s</span><span className="score-counter" key={score}>{score} pontos</span></div><div className="hearts-board" ref={boardRef}>
              {Array.from({ length: 9 }, (_, index) => <button key={index} disabled={index !== target} aria-label={'Pegar coração ' + (index + 1)} className={index === target ? 'heart-target' : ''}
                onClick={event => {
                  if (phaseRef.current !== 'playing') return;
                  if (elapsedBeforePause.current + performance.now() - start.current >= 12000) { finish(scoreRef.current); return; }
                  scoreRef.current++; setScore(scoreRef.current); setCaught({ index, sequence: scoreRef.current });
                  const next = (target + 1 + Math.floor(Math.random() * 8)) % 9; setTarget(next);
                  if (event.detail === 0) requestAnimationFrame(() => boardRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus({ preventScroll: true }));
                }}>{index === target ? <span className="catch-heart" key={score}><Icon name="heart" size={30} /></span> : <span aria-hidden="true">·</span>}{caught?.index === index && <span className="caught-heart" key={'caught-' + caught.sequence} aria-hidden="true"><Icon name="heart" size={23} /><b>+1</b></span>}</button>)}
            </div></>
              : <div className="timing-game"><div className="game-info"><span>{seconds}s</span><span>até 10 pontos</span></div><p>Pertinho do centro…</p><div className="timing-meter" aria-hidden="true"><span className="sweet-spot" /><span ref={meterRef} className="timing-pointer"><i /></span></div>
                <button className="brass-button" onClick={() => {
                  const elapsed = elapsedBeforePause.current + performance.now() - start.current;
                  finish(elapsed >= 10000 ? 0 : Math.max(0, 10 - Math.floor(Math.abs(meter.current - 50) / 5)));
                }}>Parar agora</button></div>}
      </div>
    </div>
    <div className="game-announcement" role="status">{phase === 'done' ? score + ' ' + (score === 1 ? 'ponto adicionado' : 'pontos adicionados') + ' ao saldo.' : phase === 'paused' ? 'Rodada pausada.' : ''}</div>
    <button className="brass-button game-start" disabled={phase !== 'ready' && phase !== 'done'} aria-hidden={phase !== 'ready' && phase !== 'done'} onClick={begin}>{phase === 'done' ? 'Jogar de novo' : 'Vamos jogar'} <Icon name="play" size={15} /></button>
    <span className="hint">Seu saldo: {progress.points} pontos de carinho</span>
  </div>;
}

export function Signature({ progress, setScene }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const hasInk = useRef(Boolean(progress.scenes.signatureImage));
  const initialImage = useRef(typeof progress.scenes.signatureImage === 'string' ? progress.scenes.signatureImage : '');
  const loadGeneration = useRef(0);
  const [hasDrawing, setHasDrawing] = useState(hasInk.current);

  useEffect(() => {
    const canvas = canvasRef.current, context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let active = true;
    function paint() {
      if (!canvas || !context) return;
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.round(width * scale), nextHeight = Math.round(height * scale);
      if (!width || !height || (canvas.width === nextWidth && canvas.height === nextHeight)) return;
      const previous = document.createElement('canvas');
      previous.width = canvas.width; previous.height = canvas.height;
      previous.getContext('2d')?.drawImage(canvas, 0, 0);
      canvas.width = nextWidth; canvas.height = nextHeight;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.strokeStyle = '#64364c'; context.fillStyle = '#64364c'; context.lineWidth = 2.3; context.lineCap = 'round'; context.lineJoin = 'round';
      if (hasInk.current && previous.width && previous.height) {
        const fitted = Math.min(width / previous.width, height / previous.height);
        const imageWidth = previous.width * fitted, imageHeight = previous.height * fitted;
        context.drawImage(previous, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
      }
      pointer.current = null;
    }
    paint();
    if (initialImage.current) {
      const generation = loadGeneration.current;
      const image = new Image();
      image.onload = () => {
        if (!active || generation !== loadGeneration.current || !canvas || !context) return;
        const width = canvas.clientWidth, height = canvas.clientHeight;
        const fitted = Math.min(width / image.width, height / image.height);
        context.clearRect(0, 0, width, height);
        context.drawImage(image, (width - image.width * fitted) / 2, (height - image.height * fitted) / 2, image.width * fitted, image.height * fitted);
      };
      image.src = initialImage.current;
    }
    const observer = new ResizeObserver(paint); observer.observe(canvas);
    return () => { active = false; observer.disconnect(); };
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  function endStroke(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setScene('signatureImage', event.currentTarget.toDataURL('image/png'));
  }

  return <div className="signature-scene" data-gesture="true">
    <div className="promises-paper"><div className="promise-heart"><Icon name="heart" size={24} /></div>
      {album.promises.map((promise, index) => <p key={promise}><span>{String(index + 1).padStart(2, '0')}</span>{promise}</p>)}
      <div className={'signature-area ' + (hasDrawing ? 'has-signature' : '')}>
        {!hasDrawing && <span className="signature-placeholder" aria-hidden="true">Um rabisco seu cabe aqui.</span>}
        <canvas ref={canvasRef} aria-label="Espaço para desenhar uma assinatura simbólica"
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            loadGeneration.current++; pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId);
            const context = event.currentTarget.getContext('2d'); if (!context) return;
            const [x, y] = point(event); context.beginPath(); context.arc(x, y, 1.15, 0, Math.PI * 2); context.fill(); context.beginPath(); context.moveTo(x, y);
            if (!hasInk.current) { hasInk.current = true; setHasDrawing(true); }
          }} onPointerMove={event => {
            if (pointer.current !== event.pointerId) return;
            const context = event.currentTarget.getContext('2d'); if (!context) return;
            const [x, y] = point(event); context.lineTo(x, y); context.stroke(); context.beginPath(); context.moveTo(x, y);
          }} onPointerUp={endStroke} onPointerCancel={endStroke} />
        <span>seu rabisco de carinho</span>
      </div>
      <label className="signature-label">Ou deixe seu nome<input maxLength={60} autoComplete="given-name" placeholder="Seu nome, com carinho" value={String(progress.scenes.signatureName || '')} onChange={event => setScene('signatureName', event.target.value)} /></label>
    </div>
    <button className="text-button" disabled={!hasDrawing && !progress.scenes.signatureName} onClick={() => {
      loadGeneration.current++; pointer.current = null; hasInk.current = false; initialImage.current = '';
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      setHasDrawing(false); setScene('signatureImage', ''); setScene('signatureName', '');
    }}>Limpar e refazer <Icon name="reset" size={14} /></button>
    <p className="hint">Um gesto simbólico. Pode seguir sem assinar.</p>
  </div>;
}

