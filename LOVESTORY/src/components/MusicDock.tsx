import { prefersReducedMotion } from '../lib/motion';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { album } from '../content/album';
import { Icon } from './Art';

interface PlaybackEvent { data: { isPaused: boolean; isBuffering: boolean } }
interface Controller {
  pause: () => void; resume: () => void; destroy: () => void;
  addListener: (name: string, callback: (event: PlaybackEvent) => void) => void;
}
interface SpotifyAPI { createController: (element: HTMLElement, options: { uri: string; width: string; height: number }, callback: (controller: Controller) => void) => void }
declare global { interface Window { onSpotifyIframeApiReady?: (api: SpotifyAPI) => void } }
let spotifyAPI: Promise<SpotifyAPI> | null = null;
function loadSpotify() {
  if (spotifyAPI) return spotifyAPI;
  spotifyAPI = new Promise<SpotifyAPI>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('Spotify unavailable')), 12000);
    window.onSpotifyIframeApiReady = api => { clearTimeout(timeout); resolve(api); };
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Spotify unavailable')); };
    document.head.appendChild(script);
  });
  return spotifyAPI;
}

export interface MusicHandle { pause: () => void; resume: () => void; isPlaying: () => boolean }
export const MusicDock = forwardRef<MusicHandle, { onDismiss: () => void; onPlayback: (playing: boolean) => void; suspended: boolean }>(function MusicDock({ onDismiss, onPlayback, suspended }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const playing = useRef(false);
  const pendingResume = useRef(false);
  const playback = useRef(onPlayback); playback.current = onPlayback;
  const [status, setStatus] = useState<'loading'|'ready'|'fallback'>('loading');
  const [closing, setClosing] = useState(false);
  const dismissTimer = useRef<number | undefined>(undefined);
  const suspendedRef = useRef(suspended); suspendedRef.current = suspended;
  useImperativeHandle(ref, () => ({
    pause: () => { pendingResume.current = false; controller.current?.pause(); playing.current = false; playback.current(false); },
    resume: () => { if (suspendedRef.current) pendingResume.current = true; else controller.current?.resume(); },
    isPlaying: () => playing.current,
  }), []);
  useEffect(() => {
    let cancelled = false;
    let readyTimeout: number | undefined;
    const container = host.current!;
    const mount = document.createElement('div'); container.appendChild(mount);
    void loadSpotify().then(api => {
      if (cancelled) return;
      api.createController(mount, { uri: album.music.spotifyUri, width: '100%', height: 80 }, player => {
        if (cancelled) { player.destroy(); return; }
        controller.current = player;
        readyTimeout = window.setTimeout(() => {
          if (cancelled) return;
          player.pause(); player.destroy(); controller.current = null;
          setStatus('fallback');
        }, 10000);
        player.addListener('ready', () => {
          if (cancelled) return;
          clearTimeout(readyTimeout);
          setStatus('ready');
          container.querySelector('iframe')?.setAttribute('title', 'Totalmente Seu — Marisa Monte, player oficial do Spotify');
          if (!suspendedRef.current) player.resume();
        });
        player.addListener('playback_update', event => {
          if (cancelled) return;
          playing.current = !event.data.isPaused;
          if (suspendedRef.current && playing.current) { player.pause(); playing.current = false; }
          playback.current(playing.current);
        });
      });
    }).catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => { cancelled = true; clearTimeout(readyTimeout); clearTimeout(dismissTimer.current); controller.current?.pause(); controller.current?.destroy(); controller.current = null; container.replaceChildren(); };
  }, []);
  useEffect(() => {
    if (suspended) { controller.current?.pause(); playing.current = false; playback.current(false); }
    else if (pendingResume.current) { pendingResume.current = false; controller.current?.resume(); }
  }, [suspended]);
  return <section className={`music-dock ${closing ? 'music-dock-closing' : ''}`} aria-label="Nossa música">
    <div className="music-dock-heading"><span><Icon name="sound" size={15}/>{album.music.title} <i>· {album.music.artist}</i></span><button className="icon-button" aria-label="Guardar a música" disabled={closing} onClick={() => {
      controller.current?.pause();
      if (prefersReducedMotion()) { onDismiss(); return; }
      setClosing(true); dismissTimer.current = window.setTimeout(onDismiss, 300);
    }}><Icon name="close" size={16}/></button></div>
    <div className="spotify-host" ref={host} hidden={status === 'fallback'}/>
    {status === 'loading' && <p className="music-loading" role="status">Preparando a nossa canção…</p>}
    {status === 'fallback' && <div className="music-unavailable"><Icon name="heart" size={25}/><span>Uma canção para ficar um pouquinho aqui.<small>O player não carregou nesta conexão.</small></span><a href={album.music.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label="Ouvir Totalmente Seu no Spotify"><Icon name="play" size={18}/></a></div>}
    <p className="music-dock-note">{suspended ? 'Nossa canção faz uma pausa para o cinema.' : 'Toque no play do Spotify para ouvir.'} <a href={album.music.spotifyUrl} target="_blank" rel="noopener noreferrer">Abrir no Spotify ↗</a></p>
  </section>;
});
