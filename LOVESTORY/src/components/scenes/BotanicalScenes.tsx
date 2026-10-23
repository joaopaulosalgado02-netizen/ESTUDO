import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from '../../lib/motion';
import { Icon } from '../Art';
import type { SceneProps } from './types';
import '../../styles/botanical.css';

const petals = [
  ['M150 165C105 181 56 150 52 105c31-27 83-7 98 60Z', -30, -14],
  ['M150 165c48 16 96-16 98-60-35-26-84-5-98 60Z', 30, 14],
  ['M150 163C98 159 76 111 89 68c40-7 67 38 61 95Z', -22, -7],
  ['M150 163c52-4 74-52 61-95-40-7-67 38-61 95Z', 22, 7],
  ['M151 158c-40-13-55-65-28-97 34 7 46 57 28 97Z', -12, -3],
  ['M149 158c40-13 55-65 28-97-34 7-46 57-28 97Z', 12, 3],
] as const;

export function FlowerScene({ progress, setScene }: SceneProps) {
  const open = Boolean(progress.scenes.flower);
  const id = useId();
  return <div className={`flower-scene botanical-flower ${open ? 'flower-is-open' : ''}`}>
    <span className="botanical-caption">uma delicadeza para Mima</span>
    <button className="art-button rose-touch" aria-label={open ? 'Fechar a flor' : 'Abrir a flor'} aria-expanded={open} onClick={() => setScene('flower', !open)}>
      <svg className={`rose-art living-rose ${open ? 'bloomed' : ''}`} viewBox="0 0 300 350" aria-hidden="true">
        <defs><linearGradient id={id + '-petal'} x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#efbbc2"/><stop offset=".42" stopColor="#be657f"/><stop offset="1" stopColor="#7c314e"/></linearGradient><linearGradient id={id + '-core'} x2=".7" y2="1"><stop stopColor="#e6a0ad"/><stop offset="1" stopColor="#92374f"/></linearGradient></defs>
        <ellipse cx="150" cy="328" rx="58" ry="5" fill="#8e6c4820"/>
        <path d="M150 326c-15-52 23-107 0-165" fill="none" stroke="#687953" strokeWidth="4.5"/>
        <g className="rose-leaf rose-leaf-left"><path d="M150 267c-48 5-80-27-82-55 43-8 73 18 82 55Z" fill="#84916b" stroke="#61734f"/><path d="m77 219 66 43m-43-42 2 21m23-11 0 22" fill="none" stroke="#b9c498" strokeWidth="1"/></g>
        <g className="rose-leaf rose-leaf-right"><path d="M156 231c42 1 68-31 65-58-42-1-64 27-65 58Z" fill="#6e8057" stroke="#61734f"/><path d="m215 180-54 46m39-42-4 20m-16-11-2 18" fill="none" stroke="#b5c191" strokeWidth="1"/></g>
        <path d="m130 157 21 27 23-26-24 10Z" fill="#637750"/>
        {petals.map(([d, closed, opened], index) => <g key={d} className={`rose-petal petal-${index}`} style={{ '--closed-angle': `${closed}deg`, '--open-angle': `${opened}deg`, '--petal-delay': `${index * 95}ms` } as CSSProperties}><path d={d} fill={`url(#${id}-petal)`} stroke="#94475d" strokeWidth=".75"/><path d={d} fill="none" stroke="#ffd9d1" strokeWidth=".5" opacity=".3" transform="translate(0 -2)"/></g>)}
        <g className="rose-heart"><path d="M150 154c-35-18-43-59-17-82 12 4 17 13 17 13s10-14 22-14c22 28 11 64-22 83Z" fill={`url(#${id}-core)`} stroke="#9a435e"/><path d="M128 106c17-18 46-11 43 4-2 14-20 28-20 28s-27-14-23-32Z" fill="#c76c83" stroke="#a24a63"/><path d="M140 106q18-12 22 3l-11 14Z" fill="#9b415d"/><path d="M133 105q17-12 29 2" fill="none" stroke="#f3b3b8" strokeWidth="1.5"/></g>
      </svg>
    </button>
    <div className="botanical-note"><span className={!open ? 'botanical-visible' : ''}>Um pequeno gesto,<br/>só para você.</span><span className={open ? 'botanical-visible' : ''}>Que não falte delicadeza<br/>nos nossos dias.</span></div>
    <span className="hint">Toque na rosa para {open ? 'guardar o carinho' : 'ver cada pétala abrir'}.</span>
  </div>;
}

const plantNames = ['carinho', 'cuidado', 'companhia'];
export function GardenScene({ progress, setScene }: SceneProps) {
  const saved = progress.scenes.garden;
  const growth = Array.isArray(saved) && saved.length === 3 ? saved.map(level => Math.max(0, Math.min(3, level))) : [0, 0, 0];
  const currentGrowth = useRef(growth); currentGrowth.current = growth;
  const [watering, setWatering] = useState<number[]>([]);
  const active = useRef(new Set<number>());
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const grow = (index: number) => {
    const next = [...currentGrowth.current]; next[index] = Math.min(3, next[index] + 1);
    currentGrowth.current = next; setScene('garden', next);
  };
  const water = (index: number) => {
    if (active.current.has(index)) return;
    if (prefersReducedMotion()) { grow(index); return; }
    active.current.add(index); setWatering(previous => [...previous, index]);
    timers.current.push(window.setTimeout(() => grow(index), 480));
    timers.current.push(window.setTimeout(() => { active.current.delete(index); setWatering(previous => previous.filter(item => item !== index)); }, 1250));
  };
  return <div className="garden-scene botanical-garden"><p className="scene-intro">Tudo que recebe carinho<br/>encontra um jeito de florescer.</p><div className="garden-plants">{growth.map((level, index) => <button className={`plant level-${level} ${watering.includes(index) ? 'plant-watering' : ''}`} key={index} disabled={watering.includes(index)} onClick={() => water(index)} aria-label={`Regar ${plantNames[index]}, etapa ${level} de 3`}>
    <span className="garden-water" aria-hidden="true"><i/><i/><i/><i/></span>
    <svg viewBox="0 0 100 190" aria-hidden="true"><ellipse cx="50" cy="179" rx="33" ry="4" fill="#70654722"/><path className="plant-stem" d="M50 143Q43 97 50 43" style={{ transform: `scaleY(${.15 + level * .28})` }} stroke="#71825a" strokeWidth="3.5" fill="none"/>
      <g className={`plant-leaf leaf-left ${level > 0 ? 'grown' : ''}`}><path d="M49 119Q17 119 18 91q30 1 31 28Z" fill="#94a27b" stroke="#71835e"/><path d="m22 95 23 20" stroke="#c3cba5"/></g>
      <g className={`plant-leaf leaf-right ${level > 1 ? 'grown' : ''}`}><path d="M49 94Q80 91 79 64q-28 3-30 30Z" fill="#71865d" stroke="#657b54"/><path d="m74 70-22 21" stroke="#b8c79c"/></g>
      <g className={`plant-bloom ${level === 3 ? 'grown' : ''}`}>{Array.from({ length: 7 }, (_, petal) => <g className="garden-petal" key={petal} style={{ '--petal-angle': `${petal * 360 / 7}deg`, '--petal-delay': `${petal * 80}ms` } as CSSProperties}><path d="M50 45C34 42 35 20 46 21c12-5 18 16 4 24Z" fill={['#cf8b9c', '#daa680', '#c4b2cf'][index]} stroke="#aa7880" strokeWidth=".6"/></g>)}<circle cx="50" cy="45" r="7" fill="#d3ad60"/><circle cx="48" cy="43" r="2" fill="#f0d59b"/></g>
      <path d="M20 141h60l-7 32q-23 10-46 0Z" fill="#b18163" stroke="#946e53"/><path d="M17 138h66v9H17Z" fill="#c59a79" stroke="#a27b5d"/><path d="m29 151 4 20" stroke="#dec1a0" strokeWidth="2" opacity=".65"/><path d="M24 154h52" stroke="#a67a5a" opacity=".45"/>
    </svg><span>{plantNames[index]}</span><small>{level === 3 ? 'floresceu' : `${level}/3`}</small>
  </button>)}</div><p className="handwritten" aria-live="polite">{growth.every(level => level === 3) ? 'Olha o que a gente cultivou.' : 'Uma gotinha de cuidado, um dia de cada vez.'}</p><button className="text-button" onClick={() => { timers.current.forEach(clearTimeout); active.current.clear(); setWatering([]); currentGrowth.current = [0, 0, 0]; setScene('garden', [0, 0, 0]); }}>Plantar de novo <Icon name="reset" size={15}/></button></div>;
}
