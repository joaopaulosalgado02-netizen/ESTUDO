import { useEffect, useRef, useState } from 'react';
import { Gallery, Modal, type ModalContent } from './Modal';
import { Contents } from './scenes/EarlyScenes';
import { Flourish, Icon } from './Art';
import { videos } from './Photo';
import { requestOverlayExit } from '../lib/overlay-motion';

function VideoPlayer({ index }: { index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [waiting, setWaiting] = useState(false);
  useEffect(() => { const video = ref.current; return () => { video?.pause(); }; }, []);
  const video = videos[index];
  return <div className="video-player"><div className="video-stage">
    <video ref={ref} src={`${import.meta.env.BASE_URL}${video.webFile}`} controls playsInline preload="metadata" poster={`${import.meta.env.BASE_URL}media/posters/${index + 1}.jpg`}
      onWaiting={() => setWaiting(true)} onPlaying={() => setWaiting(false)} onCanPlay={() => setWaiting(false)} onPause={() => setWaiting(false)} onError={() => { setFailed(true); setWaiting(false); }}
      aria-label={`Vídeo ${index + 1} do primeiro dia de máscara facial`}/>
    {waiting && <span className="video-buffering" role="status"><span/>Preparando a lembrança…</span>}
  </div><p>10 de outubro · Nosso primeiro dia de máscara juntos.</p>
    {failed && <div className="video-retry" role="status"><p>Vamos tentar abrir esta lembrança de novo?</p><button className="text-button" onClick={() => { setFailed(false); ref.current?.load(); }}>Tentar novamente <Icon name="reset" size={15}/></button></div>}
  </div>;
}

export default function AlbumOverlay({ content, close, navigate, reset }: { content: ModalContent; close: () => void; navigate: (index: number) => void; reset: () => void }) {
  const common = { close, origin: content.origin };
  switch (content.kind) {
    case 'contents': return <Modal {...common} variant="contents" title="As páginas da nossa história" wide><Contents navigate={navigate} compact/></Modal>;
    case 'gallery': return <Modal {...common} variant="photo" title="Nossas fotografias" wide><Gallery initial={content.label}/></Modal>;
    case 'text': return <Modal {...common} variant="letter" title={content.title}><div className="letter-content">{content.text.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}<Flourish/></div></Modal>;
    case 'video': return <Modal {...common} variant="video" title={`Pequeno cinema · lembrança 0${content.index + 1}`}><VideoPlayer key={content.index} index={content.index}/></Modal>;
    case 'reset': return <Modal {...common} title="Folhear desde o começo?"><div className="reset-content"><p>Isso apaga neste navegador as páginas visitadas, bilhetes, jogos, vales e sua assinatura. As nossas lembranças continuam no livro.</p><div className="button-row"><button className="pill-button" onClick={() => { if (!requestOverlayExit(reset)) reset(); }}>Recomeçar o álbum</button><button className="text-button" onClick={() => requestOverlayExit(() => {})}>Continuar de onde parei</button></div></div></Modal>;
  }
}
