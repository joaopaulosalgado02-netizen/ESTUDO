import manifest from '../content/media.json';
import { photoLabels, type PhotoLabel } from '../content/photo-story';

type ManifestItem = typeof manifest[number];
export type PhotoAsset = ManifestItem & { type: 'image'; label: PhotoLabel };

export const photos = manifest.filter((item): item is PhotoAsset => item.type === 'image' && Boolean(item.label))
  .sort((a, b) => a.label.localeCompare(b.label));
export const videos = manifest.filter(item => item.type === 'video');
const photoIndex = new Map<string, PhotoAsset>(photos.map(item => [item.label, item]));

export function photoByLabel(label: string): PhotoAsset {
  const photo = photoIndex.get(label);
  if (!photo) throw new Error(`Fotografia desconhecida: ${label}. Esperado: ${photoLabels.join(', ')}.`);
  return photo;
}

export function mediaUrl(file: string) {
  return `${import.meta.env.BASE_URL}${file.replace(/^\/+/, '')}`;
}

export function photoSources(photo: PhotoAsset) {
  return [...[96, 320, 640, 960].filter(width => width < photo.width).map(width => `${mediaUrl(`media/optimized/${photo.label.toLowerCase()}-${width}.jpg`)} ${width}w`), `${mediaUrl(photo.webFile)} ${photo.width}w`].join(', ');
}

/** Browser caching deduplicates thumbnails, page photos and adjacent gallery photos. */
export function preloadPhoto(label: string, sizes: string) {
  const photo = photoByLabel(label);
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.sizes = sizes;
  image.srcset = photoSources(photo);
  image.src = mediaUrl(photo.webFile);
  return image;
}
