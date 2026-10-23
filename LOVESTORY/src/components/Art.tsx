import { useId } from 'react';

export function Icon({ name, size = 22 }: { name: 'heart' | 'back' | 'next' | 'book' | 'sound' | 'close' | 'play' | 'home' | 'reset'; size?: number }) {
  const paths = {
    heart: 'M12 21S2 15 2 8.5a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3C22 15 12 21 12 21Z',
    back: 'm14 5-7 7 7 7', next: 'm10 5 7 7-7 7', book: 'M12 5v15M3 3c4 0 7 0 9 2 2-2 5-2 9-2v15c-4 0-7 0-9 2-2-2-5-2-9-2Z',
    sound: 'M3 9v6h4l5 4V5L7 9ZM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14',
    close: 'm6 6 12 12M6 18 18 6', play: 'm8 4 12 8-12 8Z', home: 'm3 10 9-8 9 8M5 9v12h14V9M9 21v-8h6v8', reset: 'M3 10a9 9 0 1 1 1 8M3 3v7h7',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function Flourish({ className = '' }: { className?: string }) {
  return <svg className={`flourish ${className}`} viewBox="0 0 220 60" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".9"><path d="M110 49C80 49 66 19 28 27c-23 5-15 25-2 20 15-6-10-28-13-38M110 49c30 0 44-30 82-22 23 5 15 25 2 20-15-6 10-28 13-38M48 31c4-10 13-14 25-11-5 9-13 13-25 11Zm-14-4c-10-5-12-13-8-22 10 5 13 13 8 22Zm138 4c-4-10-13-14-25-11 5 9 13 13 25 11Zm14-4c10-5 12-13 8-22-10 5-13 13-8 22Z"/><path d="M110 46s-18-11-14-20c4-7 12-5 14 0 2-5 10-7 14 0 4 9-14 20-14 20Z"/><circle cx="110" cy="54" r="2"/></g></svg>;
}

export function Rose({ open = false }: { open?: boolean }) {
  const id = useId();
  return <svg className={`rose-art ${open ? 'bloomed' : ''}`} viewBox="0 0 300 350" aria-hidden="true"><defs><linearGradient id={id} x2=".7" y2="1"><stop stopColor="#d899a3"/><stop offset=".45" stopColor="#a44860"/><stop offset="1" stopColor="#61233c"/></linearGradient></defs><path d="M153 321c-6-69 14-100-1-178" fill="none" stroke="#58644a" strokeWidth="5"/><g fill="#6d7a56" stroke="#3e5540" strokeWidth="1"><path d="M151 259c-58 3-78-31-81-58 43 0 75 13 81 58Z"/><path d="M155 228c49-8 64-33 63-58-38 7-62 24-63 58Z"/></g><g className="petals" fill={`url(#${id})`} stroke="#813b52" strokeWidth="1"><path d="M149 162C82 162 48 117 60 75c47-4 83 30 89 87Z"/><path d="M150 162c62 2 98-42 87-89-47-1-81 31-87 89Z"/><path d="M150 156C101 145 85 69 115 39c39 17 53 63 35 117Z"/><path d="M149 156c48-12 64-86 34-117-38 16-53 65-34 117Z"/><path d="M150 143c-48-20-36-69 0-92 37 25 49 72 0 92Z"/><path d="M129 108c-1-18 38-24 40-3 2 20-21 33-21 33s-27-14-19-30Z"/></g><g stroke="#9eaa79" fill="none"><path d="m74 205 64 47m78-78-56 49"/></g></svg>;
}

export function Clock() {
  return <svg className="clock-art" viewBox="0 0 300 280" aria-hidden="true"><path d="M42 242h216l14 22H28Z" fill="#825d3d"/><path d="M66 240V126a84 84 0 0 1 168 0v114Z" fill="#b08a59" stroke="#704c32" strokeWidth="4"/><circle cx="150" cy="132" r="73" fill="#f7edda" stroke="#6f4b35" strokeWidth="5"/><circle cx="150" cy="132" r="64" fill="none" stroke="#bb9a68"/>{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30} 150 132)`}><path d="M150 75v8" stroke="#826147" strokeWidth="2"/></g>)}<g stroke="#5e352c" strokeLinecap="round"><path d="M150 132V94" strokeWidth="4" transform="rotate(50 150 132)"/><path className="clock-hand" d="M150 132V81" strokeWidth="2"/></g><circle cx="150" cy="132" r="5" fill="#a67a49"/><path d="M138 217h24" stroke="#644a35" strokeWidth="3"/></svg>;
}

export function Jar({ open }: { open: boolean }) {
  const glassId = useId();
  return <svg className={`jar-art ${open ? 'jar-open' : ''}`} viewBox="0 0 280 300" aria-hidden="true"><defs><linearGradient id={glassId} x2="1" y2=".3"><stop stopColor="#fff" stopOpacity=".5"/><stop offset=".4" stopColor="#fff" stopOpacity=".08"/><stop offset="1" stopColor="#b8c6b3" stopOpacity=".45"/></linearGradient></defs><ellipse cx="140" cy="279" rx="92" ry="10" fill="#533d31" opacity=".12"/><path d="M91 66h98v31c2 12 32 17 35 47v99q0 28-31 29H87q-31-1-31-29v-99c3-30 33-35 35-47Z" fill={`url(#${glassId})`} stroke="#a5ada2" strokeWidth="2"/>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={77 + i % 3 * 38} y={153 + Math.floor(i / 3) * 28} width="44" height="24" rx="2" fill={['#e0b9b6', '#efe0ab', '#bdc8ae'][i % 3]} stroke="#ad9275" transform={`rotate(${(i % 3 - 1) * 18} ${99 + i % 3 * 38} ${165 + Math.floor(i / 3) * 28})`}/>)}<path d="M73 144v92q0 16 13 18" fill="none" stroke="white" strokeWidth="5" opacity=".6"/><g className="jar-cork"><rect x="85" y="45" width="110" height="29" rx="7" fill="#af865c" stroke="#785a3e"/><path d="M93 53h94m-87 12h80" stroke="#c6a17b" strokeWidth="2"/></g><path d="M90 99c25 7 75 7 100 0" fill="none" stroke="#a3a99a"/><rect x="92" y="121" width="96" height="40" rx="3" fill="#f7e9d3" stroke="#c7b28c"/><text x="140" y="146" textAnchor="middle" fontFamily="Georgia" fontSize="15" fill="#825453">para Mima</text></svg>;
}

export function Camera({ eject = false }: { eject?: boolean }) {
  return <svg className={`camera-art ${eject ? 'camera-click' : ''}`} viewBox="0 0 320 250" aria-hidden="true"><path d="M66 55h188l30 150H36Z" fill="#e9deca" stroke="#a18b71" strokeWidth="2"/><path d="M66 55 88 23h144l22 32Z" fill="#bfaa90"/><rect x="77" y="63" width="66" height="29" rx="4" fill="#b5b3a4" stroke="#8f8673"/><rect x="185" y="67" width="40" height="21" rx="3" fill="#59433d"/><path d="M48 143h224l12 62H36Z" fill="#80505a"/><circle cx="160" cy="121" r="45" fill="#56483d" stroke="#b7a28c" strokeWidth="7"/><circle cx="160" cy="121" r="30" fill="#23313b" stroke="#87938e" strokeWidth="3"/><circle cx="151" cy="110" r="10" fill="#b6cec7" opacity=".5"/><circle cx="242" cy="121" r="10" fill="#bd785e"/><rect x="87" y="172" width="146" height="12" rx="4" fill="#3a3030"/><path d="M59 203h201" stroke="#f4ead6" strokeWidth="2"/></svg>;
}

export function Lock({ locked = false }: { locked?: boolean }) {
  return <svg className={`lock-art ${locked ? 'is-locked' : ''}`} viewBox="0 0 180 200" aria-hidden="true"><path className="lock-shackle" d="M49 95V54a41 41 0 0 1 82 0v41" fill="none" stroke="#bfa574" strokeWidth="12"/><path d="M30 85q60-12 120 0v79q-60 23-120 0Z" fill="#bc9354" stroke="#8b642f" strokeWidth="2"/><path d="M40 96q50-9 100 0v59q-50 17-100 0Z" fill="none" stroke="#e2c78f"/><text x="90" y="129" fontSize="23" textAnchor="middle" fill="#5f421f" fontFamily="Georgia">J &amp; J</text><path d="M86 145h8" stroke="#6b4b29" strokeWidth="4"/></svg>;
}

export function Stars() {
  return <div className="stars" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} className={i % 4 === 0 ? 'twinkling' : undefined} style={{ left: `${(i * 37.3) % 100}%`, top: `${(i * 19.7) % 90}%`, animationDelay: `${i % 5}s`, width: i % 4 ? 2 : 3, height: i % 4 ? 2 : 3 }}/>)}</div>;
}
