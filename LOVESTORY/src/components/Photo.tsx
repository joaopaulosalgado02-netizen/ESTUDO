import { useState } from 'react';
import { photoCaptions, type PhotoLabel } from '../content/photo-story';
import { mediaUrl, photoByLabel, photoSources, type PhotoAsset } from '../lib/media';
import '../styles/photo-gallery.css';

export { photos, videos, photoByLabel } from '../lib/media';
export const caption = (label: string) => photoCaptions[label as PhotoLabel] || 'Uma lembrança nossa';

function PhotoImage({ item, eager, alt, sizes }: { item: PhotoAsset; eager: boolean; alt?: string; sizes: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const sideways = Math.abs(item.rotationCssDeg || 0) % 180 === 90;
  return <span
    className={`photo-image ${sideways ? 'sideways' : ''}`}
    style={{ aspectRatio: sideways ? `${item.height}/${item.width}` : `${item.width}/${item.height}` }}
    data-state={state}
    aria-busy={state === 'loading'}
  >
    <img
      src={mediaUrl(item.webFile)}
      srcSet={photoSources(item)}
      sizes={sizes}
      alt={alt ?? item.description}
      width={item.width}
      height={item.height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      className={sideways ? 'rotated-photo' : undefined}
      onLoad={() => setState('ready')}
      onError={() => setState('error')}
    />
    {state === 'error' && <span className="photo-unavailable" role="status">Esta fotografia não carregou.<br/>Tente abrir novamente.</span>}
  </span>;
}

export function Photo({ label, className = '', onClick, eager = false, showCaption = true, alt, sizes = '(max-width: 600px) 300px, 380px', ariaHidden }: {
  label: string;
  className?: string;
  onClick?: () => void;
  eager?: boolean;
  showCaption?: boolean;
  alt?: string;
  sizes?: string;
  ariaHidden?: boolean;
}) {
  const item = photoByLabel(label);
  const picture = <><PhotoImage key={item.id} item={item} eager={eager} alt={alt} sizes={sizes}/>{showCaption && <span className="photo-caption">{caption(label)}</span>}</>;
  return onClick
    ? <button type="button" className={`polaroid ${className}`} data-photo={label} onClick={onClick} aria-label={`Ampliar: ${caption(label)}`}>{picture}</button>
    : <div className={`polaroid ${className}`} data-photo={label} aria-hidden={ariaHidden}>{picture}</div>;
}
