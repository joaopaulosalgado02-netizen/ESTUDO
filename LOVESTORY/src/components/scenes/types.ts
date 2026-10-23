import type { ModalContent } from '../Modal';
import type { Progress, SceneValue } from '../../lib/progress';
export interface SceneProps {
  number: number;
  progress: Progress;
  setScene: (key: string, value: SceneValue) => void;
  update: (change: Partial<Progress> | ((previous: Progress) => Progress)) => void;
  openModal: (content: ModalContent) => void;
  navigate: (index: number) => void;
  playMusic: () => void;
  closeBook: () => void;
}
