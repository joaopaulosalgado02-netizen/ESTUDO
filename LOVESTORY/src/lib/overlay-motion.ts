export interface OverlayOrigin { x: number; y: number; width: number; height: number }
export function requestOverlayExit(after: () => void) {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[open]');
  if (!dialog) return false;
  dialog.dispatchEvent(new CustomEvent('lovestory:request-close', { detail: { after } }));
  return true;
}
