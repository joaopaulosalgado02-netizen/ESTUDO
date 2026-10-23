import { lazy, Suspense, useEffect } from 'react';
import { pages } from '../content/album';
import { Stars } from './Art';
import { EarlyScenes } from './scenes/EarlyScenes';
import type { SceneProps } from './scenes/types';

const loadMemories = () => import('./scenes/MemoryScenes');
const loadPlay = () => import('./scenes/PlayScenes');
const MemoryScenes = lazy(() => loadMemories().then(module => ({ default: module.MemoryScenes })));
const PlayScenes = lazy(() => loadPlay().then(module => ({ default: module.PlayScenes })));

export function BookPage(props:SceneProps){
  const page=pages[props.number-1];
  useEffect(() => {
    if (props.number !== 9 && props.number !== 10 && props.number !== 18 && props.number !== 19) return;
    const timer = window.setTimeout(() => { if (props.number < 11) void loadMemories(); else void loadPlay(); }, 400);
    return () => clearTimeout(timer);
  }, [props.number]);
  return <article className={`book-page theme-${page[2]}`} data-page={props.number} aria-label={`Página ${props.number}: ${page[0]}`}><div className="paper-grain" aria-hidden="true"/>{page[2]==='night'&&<Stars/>}<div className="page-scroll"><header className="page-heading"><span className="eyebrow">{String(props.number).padStart(2,'0')} / {page[0]}</span><h2>{page[1]}</h2><span className="heading-divider"/></header><div className="page-scene"><Suspense fallback={<div className="scene-loading" role="status">Um instante, uma lembrança…</div>}>{props.number<=10?<EarlyScenes {...props}/>:props.number<=19?<MemoryScenes {...props}/>:<PlayScenes {...props}/>}</Suspense></div></div><footer className="page-folio"><span>Jemima &amp; João</span><i>{String(props.number).padStart(2,'0')}</i><span>um pouco de nós</span></footer></article>;
}
