import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { album, pages } from './content/album';
import { useProgress } from './lib/progress';
import { useMediaQuery, useMotionPreference, useVisibilityMotion } from './lib/motion';
import { Cover } from './components/Cover';
import { BookMechanism, sampleCover, type CoverSample } from './components/BookMechanism';
import { Icon } from './components/Art';
import { capturePage, PageTurn, type TurnSnapshot } from './components/PageTurn';
import type { ModalContent } from './components/Modal';
import { requestOverlayExit } from './lib/overlay-motion';
import { MusicDock, type MusicHandle } from './components/MusicDock';

const loadBook = () => import('./components/BookPage');
const BookPage = lazy(() => loadBook().then(module => ({ default: module.BookPage })));
const AlbumOverlay = lazy(() => import('./components/AlbumOverlay'));
const NON_SWIPE = 'button,a,input,textarea,select,canvas,video,[data-gesture]';
const TURN_MS = 620;

function LoadingPage() {
  return <div className="book-loading" role="status"><Icon name="heart" size={28}/><span>Preparando a próxima lembrança…</span></div>;
}

export function App() {
  const { progress, update, setScene, reset } = useProgress();
  const wide = useMediaQuery('(min-width: 1050px)');
  const { reduced, toggleMotion } = useMotionPreference();
  useVisibilityMotion();
  const [opening, setOpening] = useState(false);
  const [closingBook, setClosingBook] = useState(false);
  const [mechanismRunning, setMechanismRunning] = useState(false);
  const coverSample = useRef<CoverSample | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [turn, setTurn] = useState<TurnSnapshot | null>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(.4);
  const [audioMessage, setAudioMessage] = useState('');
  const audio = useRef<HTMLAudioElement>(null);
  const spotify = useRef<MusicHandle>(null);
  const lastObject = useRef<HTMLElement | null>(null);
  const spread = useRef<HTMLDivElement>(null);
  const resumeAudio = useRef(false);
  const turning = useRef(false);
  const turnId = useRef(0);
  const turnTimer = useRef<number | undefined>(undefined);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const current = wide ? Math.floor(progress.page / 2) * 2 : progress.page;
  const count = wide ? 2 : 1;
  const audioConfigured = Boolean(album.music.src);

  useEffect(() => {
    const capture = (event: PointerEvent | FocusEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button,a,[role="button"]') : null;
      if (target && !target.closest('dialog,.music-dock')) lastObject.current = target;
    };
    document.addEventListener('pointerdown', capture, true); document.addEventListener('focusin', capture, true);
    return () => { document.removeEventListener('pointerdown', capture, true); document.removeEventListener('focusin', capture, true); };
  }, []);

  const finishTurn = useCallback(() => { clearTimeout(turnTimer.current); turning.current = false; setTurn(null); }, []);
  useEffect(() => () => { clearTimeout(turnTimer.current); }, []);
  // Warm the lightweight book module only after the cover has painted.
  useEffect(() => { const timer = window.setTimeout(() => { void loadBook(); }, 900); return () => clearTimeout(timer); }, []);
  useEffect(() => { finishTurn(); }, [wide, reduced, finishTurn]);

  const playMusic = useCallback(() => {
    const player = audio.current;
    if (!album.music.src) { setMusicStarted(true); spotify.current?.resume(); return; }
    if (!player) return;
    player.volume = volume;
    void player.play().then(() => { setPlaying(true); setAudioMessage(''); }).catch(() => { setPlaying(false); setAudioMessage('Toque novamente para ouvir.'); });
  }, [volume]);

  const openModal = useCallback((content: ModalContent) => {
    if (turning.current || opening || closingBook) return;
    if (content.kind === 'video') { resumeAudio.current = Boolean((audio.current && !audio.current.paused) || spotify.current?.isPlaying()); audio.current?.pause(); spotify.current?.pause(); setPlaying(false); }
    const source = lastObject.current?.isConnected ? lastObject.current : null;
    const rect = source?.getBoundingClientRect();
    setModal({ ...content, origin: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : undefined });
  }, [opening, closingBook]);

  const closeModal = useCallback(() => {
    document.querySelectorAll('dialog video').forEach(video => (video as HTMLVideoElement).pause());
    setModal(null);
    window.dispatchEvent(new Event('lovestory:overlay-closed'));
    if (resumeAudio.current) { resumeAudio.current = false; playMusic(); }
  }, [playMusic]);

  const navigatePage = useCallback((index: number) => {
    if (turning.current || opening || closingBook) return;
    const next = Math.min(pages.length - 1, Math.max(0, index));
    const normalized = wide ? Math.floor(next / 2) * 2 : next;
    setModal(null);
    if (normalized === current) return;
    const direction = normalized > current ? 1 : -1;
    const visible = spread.current?.querySelectorAll<HTMLElement>(':scope > .book-page');
    const face = visible?.[wide && direction > 0 ? 1 : 0];
    if (!reduced && face) {
      const stationary = wide ? visible?.[direction > 0 ? 0 : 1] : null;
      turning.current = true;
      setTurn({ id: ++turnId.current, direction, face: capturePage(face), stationary: stationary ? capturePage(stationary) : null });
      turnTimer.current = window.setTimeout(finishTurn, TURN_MS + 120);
    }
    update({ page: next, opened: true });
  }, [current, wide, reduced, update, finishTurn, opening, closingBook]);

  const navigate = useCallback((index: number) => { if (!requestOverlayExit(() => navigatePage(index))) navigatePage(index); }, [navigatePage]);

  const closeBook = useCallback(() => {
    if (closingBook || opening || !progress.opened) return;
    finishTurn(); setModal(null);
    if (reduced) { update({ opened: false }); return; }
    coverSample.current = null;
    setClosingBook(true);
  }, [closingBook, opening, progress.opened, reduced, finishTurn, update]);

  const openBook = useCallback(() => {
    if (opening || closingBook) return;
    void loadBook();
    if (reduced) { update({ opened: true }); return; }
    coverSample.current = sampleCover();
    setOpening(true);
  }, [opening, closingBook, reduced, update]);

  const finishBookMotion = useCallback(() => {
    update({ opened: opening });
    setOpening(false); setClosingBook(false); setMechanismRunning(false);
    coverSample.current = null;
  }, [opening, update]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (!progress.opened || opening || closingBook || modal || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as Element).closest('input,textarea,select,video,[data-gesture],[contenteditable="true"]')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); navigate(current + count); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(current - count); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [progress.opened, opening, closingBook, modal, navigate, current, count]);

  const sceneProps = { progress, setScene, update, openModal, navigate, playMusic, closeBook };
  return <main className={`album-app ${progress.opened ? 'book-is-open' : 'book-is-closed'} ${turn ? 'is-turning' : ''} ${opening ? 'is-preparing-open' : ''} ${closingBook ? 'is-closing-book' : ''} ${mechanismRunning ? 'is-moving-book' : ''} ${musicStarted ? 'with-music' : ''}`}>
    <div className="book-atmosphere" aria-hidden="true"/>
    <header className="app-header"><button className="brand" onClick={closeBook} aria-label="Voltar à capa do álbum"><Icon name="heart" size={18}/><span>LOVE<span className="brand-story">STORY</span></span></button><span className="header-caption">um presente, infinitas lembranças</span><div className="header-actions">
      <button className={`motion-control ${reduced ? '' : 'motion-active'}`} onClick={toggleMotion} disabled={opening || closingBook} aria-pressed={!reduced} aria-label={reduced ? 'Ativar animações completas' : 'Reduzir as animações'}><span aria-hidden="true">{reduced ? 'Ⅱ' : '✦'}</span><span>Animações<small>{reduced ? 'pausadas' : 'ativadas'}</small></span></button>
      <div className="audio-control"><button className={`icon-button ${playing ? 'playing' : ''}`} aria-label={playing ? 'Pausar música' : 'Ouvir nossa música'} onClick={() => { if (playing) { audio.current?.pause(); spotify.current?.pause(); setPlaying(false); } else playMusic(); }}><Icon name="sound" size={19}/></button>{audioConfigured && <label className="volume-control">Volume<input aria-label="Volume da música" type="range" min="0" max="1" step=".05" value={volume} onChange={event => { const value = Number(event.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }}/></label>}</div>
      {progress.opened && <button className="icon-button" aria-label="Abrir sumário" onClick={() => openModal({ kind: 'contents' })}><Icon name="book" size={21}/></button>}
    </div></header>
    {audioConfigured && <audio ref={audio} src={album.music.src!} preload="none" loop onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setAudioMessage('A música não abriu. Você pode tentar de novo.'); }}/ >}
    {audioMessage && <p className="audio-message" role="status">{audioMessage}</p>}
    {(!progress.opened || closingBook) && <Cover open={openBook} continuePage={progress.page} opening={opening} busy={closingBook}/>}
    {(progress.opened || opening) && <div className="reading-room" inert={opening || closingBook}>
      <div className="book-topline"><span>{wide ? 'duas páginas, uma história' : 'um instante de cada vez'}</span><button className="small-link" onClick={closeBook}>fechar o livro</button></div>
      <div className={`open-book ${wide ? 'spread' : 'single'}`} aria-busy={Boolean(turn)} onPointerDown={event => {
        pointer.current = null;
        if (modal || turning.current || (event.target as Element).closest(NON_SWIPE)) return;
        pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
      }} onPointerUp={event => {
        const start = pointer.current; pointer.current = null;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.8) navigate(current + (dx < 0 ? count : -count));
      }} onPointerCancel={() => { pointer.current = null; }}>
        <div className="book-spread" ref={spread} key={`${current}-${wide}`} inert={Boolean(turn)}><Suspense fallback={<LoadingPage/>}><BookPage {...sceneProps} number={current + 1}/>{wide && current + 1 < pages.length && <BookPage {...sceneProps} number={current + 2}/>}</Suspense></div>
        {turn && <PageTurn key={turn.id} snapshot={turn} spread={wide} currentPages={spread} done={finishTurn}/>}
        <span className="binding-ribbon" aria-hidden="true"/>
      </div>
      <nav className="book-navigation" aria-label="Navegação do livro"><button className="nav-arrow" aria-label="Página anterior" onClick={() => navigate(current - count)} disabled={current === 0 || Boolean(turn)}><Icon name="back"/><span>Anterior</span></button><button className="page-indicator" onClick={() => openModal({ kind: 'contents' })} aria-label="Ver sumário e escolher página"><Icon name="book" size={18}/><span aria-live="polite">{String(current + 1).padStart(2, '0')}{wide ? ` — ${String(Math.min(current + 2, pages.length)).padStart(2, '0')}` : ''}<i> / {pages.length}</i></span></button><button className="nav-arrow" aria-label="Próxima página" onClick={() => navigate(current + count)} disabled={current + count >= pages.length || Boolean(turn)}><span>Próxima</span><Icon name="next"/></button></nav>
      <div className="reading-progress"><span style={{ width: `${Math.min(current + count, pages.length) / pages.length * 100}%` }}/></div>
    </div>}
    {(opening || closingBook) && <BookMechanism mode={opening ? 'opening' : 'closing'} sample={coverSample.current} wide={wide} started={() => setMechanismRunning(true)} done={finishBookMotion}/>}
    {musicStarted && <MusicDock ref={spotify} suspended={modal?.kind === 'video'} onPlayback={setPlaying} onDismiss={() => { setMusicStarted(false); setPlaying(false); }}/ >}
    <footer className="app-footer"><span>Jemima &amp; João <i>·</i> um pouco de nós</span><button aria-label="Reiniciar o progresso do álbum" onClick={() => openModal({ kind: 'reset' })}><Icon name="reset" size={14}/></button></footer>
    {modal && <Suspense fallback={<span className="overlay-loading" role="status">Abrindo uma lembrança…</span>}><AlbumOverlay content={modal} close={closeModal} navigate={navigate} reset={() => { reset(); setModal(null); }}/></Suspense>}
  </main>;
}
