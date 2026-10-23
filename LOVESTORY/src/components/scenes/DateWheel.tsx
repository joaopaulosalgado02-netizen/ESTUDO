import { useEffect, useId, useRef, useState } from 'react';
import { album } from '../../content/album';
import { prefersReducedMotion } from '../../lib/motion';
import type { SceneProps } from './types';
import '../../styles/date-wheel.css';

const count = album.dateIdeas.length;
const step = 360 / count;
const positions = album.dateIdeas.map((_, index) => ({ x: 140 + Math.sin(index * Math.PI * 2 / count) * 104, y: 140 - Math.cos(index * Math.PI * 2 / count) * 104 }));

export function DateWheel({ progress, setScene }: SceneProps) {
  const saved = progress.scenes.dateIdea;
  const result = typeof saved === 'number' && Number.isInteger(saved) && saved >= 0 && saved < count ? saved : -1;
  const wheel = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLSpanElement>(null);
  const rotation = useRef(result >= 0 ? (360 - result * step) % 360 : 0);
  const [spinning, setSpinning] = useState(false);
  const busy = useRef(false);
  const animations = useRef<Animation[]>([]);
  const frame = useRef(0);
  const id = useId();
  useEffect(() => () => { animations.current.forEach(animation => animation.cancel()); cancelAnimationFrame(frame.current); }, []);
  const spin = () => {
    const rotor = wheel.current;
    if (!rotor || busy.current) return;
    const random = new Uint32Array(1); crypto.getRandomValues(random);
    const next = Math.floor(random[0] / 4294967296 * count);
    const from = rotation.current;
    const to = from + 4 * 360 + ((360 - next * step - from % 360 + 360) % 360);
    rotation.current = to;
    rotor.style.transform = `rotate(${to}deg)`;
    const cabins = [...rotor.querySelectorAll<SVGGElement>('.wheel-gondola')];
    cabins.forEach(cabin => { cabin.style.transform = `rotate(${-to}deg)`; });
    if (prefersReducedMotion()) { setScene('dateIdea', next); return; }
    busy.current = true; setSpinning(true);
    const options: KeyframeAnimationOptions = { duration: 4200, easing: 'cubic-bezier(.14,.04,.1,1)', fill: 'none' };
    const animation = rotor.animate([{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }], options);
    animations.current = [animation, ...cabins.map(cabin => cabin.animate([{ transform: `rotate(${-from}deg)` }, { transform: `rotate(${-to}deg)` }], options))];
    let lastNotch = -1;
    const tick = () => {
      const progress = animation.effect?.getComputedTiming().progress;
      const notch = Math.floor((from + (to - from) * Number(progress || 0)) / step);
      if (notch !== lastNotch) { pointer.current?.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-21deg)', offset: .25 }, { transform: 'rotate(0deg)' }], { duration: 150, easing: 'ease-out' }); lastNotch = notch; }
      if (animation.playState === 'running') frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    void animation.finished.then(() => { busy.current = false; setSpinning(false); setScene('dateIdea', next); }).catch(() => {});
  };
  return <div className={`wheel-scene tactile-wheel ${spinning ? 'wheel-spinning' : ''}`}>
    <span className="wheel-small-title">deixa o acaso escolher</span>
    <div className="tactile-wheel-stage">
      <svg className="wheel-stand" viewBox="0 0 300 330" aria-hidden="true"><ellipse cx="150" cy="315" rx="96" ry="9" fill="#0003"/><path d="m150 142-58 166h116Z" fill="#b2945a" stroke="#d4bc7b" strokeWidth="2"/><path d="m150 176-38 120h76Z" fill="#332331"/><path d="M64 309h172v8H64Z" fill="#ad8e56"/><path d="m114 249 73 45m-73 0 57-45" stroke="#d7bf82" strokeWidth="2"/></svg>
      <div className="date-wheel" ref={wheel} role="img" aria-label={spinning ? 'Roda escolhendo um encontro' : result >= 0 ? `Roda parada no número ${result + 1}: ${album.dateIdeas[result]}` : 'Roda com seis ideias de encontro'} data-result={result} style={{ transform: `rotate(${rotation.current}deg)` }}>
        <svg viewBox="0 0 280 280" aria-hidden="true"><defs><linearGradient id={id} x2="1" y2="1"><stop stopColor="#f1d599"/><stop offset=".5" stopColor="#b18e4d"/><stop offset="1" stopColor="#e4c98e"/></linearGradient></defs><circle cx="140" cy="140" r="104" fill="#79604715" stroke={`url(#${id})`} strokeWidth="3"/><circle cx="140" cy="140" r="95" fill="none" stroke="#c9ac7233"/>{positions.map(({ x,y }, index) => <g key={index}><path d={`M140 140 ${x} ${y}`} stroke="#c5a466" strokeWidth="1.5"/><circle cx={x} cy={y} r="4" fill="#e4c98a"/><g className="wheel-gondola" style={{ transformOrigin: `${x}px ${y}px`, transform: `rotate(${-rotation.current}deg)` }}><path d={`M${x-15} ${y+9}v-13q15-23 30 0v13`} fill="none" stroke="#d1af70" strokeWidth="1.5"/><path d={`M${x-18} ${y+5}h36l-4 24q-14 8-28 0Z`} fill={index % 2 ? '#ae7882' : '#cbb585'} stroke="#ebd2a1"/><text x={x} y={y+23} textAnchor="middle" fill="#392630" fontFamily="Georgia" fontSize="15">{index+1}</text></g></g>)}<circle cx="140" cy="140" r="15" fill="#b99a5e" stroke="#e3cb90" strokeWidth="2"/><path d="M140 146s-9-5-9-10q3-7 9-1 6-6 9 1 0 5-9 10" fill="#65434a"/></svg>
      </div>
      <span className="wheel-pointer" ref={pointer} aria-hidden="true"/>
    </div>
    <div className={`wheel-result ${!spinning && result >= 0 ? 'wheel-result-ready' : ''}`} aria-live="polite"><span>{spinning ? 'Dando uma voltinha no destino…' : result >= 0 ? 'o nosso próximo encontro' : 'Uma volta. Seis possibilidades.'}</span><p className="handwritten">{spinning ? 'Qual será o nosso lugar?' : result >= 0 ? album.dateIdeas[result] : 'Vamos descobrir juntos?'}</p></div>
    <button className="light-button" disabled={spinning} onClick={spin}>Girar a roda <span>↻</span></button>
    <ol className="wheel-key">{album.dateIdeas.map((idea,index) => <li key={idea} className={!spinning && result === index ? 'chosen' : ''} aria-current={!spinning && result === index ? 'true' : undefined}><span>{index+1}</span>{idea}</li>)}</ol>
  </div>;
}
