// components/IntroOverlay.jsx — the opening of advonmedia.com («Ignition», 5 Nov 2026).
// Shown once per session (html.mv-intro, decided by MV_BOOT in app/layout.jsx — never in a
// background tab or under reduced motion; add ?intro=1 to the URL to see it again):
//   0.0 s  specks of light gather from the dark into the centre of the screen
//   0.25   the Advon mark draws itself stroke by stroke, bottom slab first, then fills with colour
//   0.5    ADVON MEDIA lands letter by letter
//   1.1    the mark ignites (flash) …
//   1.3    … and the sky opens as a ring of light from the mark — the page is revealed through
//          an iris while the lockup glides into the header and becomes the real logo
//   2.5    everything is gone; the hero has already risen behind it.
// Transform/opacity only (+ one masked layer), no JS beyond the inline docking script.

const DUST = [
  { x: '37.7vmin', y: '-0.3vmin', d: '0.37s', t: '0.91s' },
  { x: '37.8vmin', y: '5.6vmin', d: '0.07s', t: '0.93s' },
  { x: '40.8vmin', y: '13.3vmin', d: '0.04s', t: '0.86s' },
  { x: '39.8vmin', y: '15.9vmin', d: '0.28s', t: '0.76s' },
  { x: '32.9vmin', y: '28.4vmin', d: '0.26s', t: '0.97s' },
  { x: '14.7vmin', y: '13.2vmin', d: '0.21s', t: '0.77s' },
  { x: '14.4vmin', y: '19.4vmin', d: '0.01s', t: '0.91s' },
  { x: '13.0vmin', y: '34.1vmin', d: '0.21s', t: '0.97s' },
  { x: '3.7vmin', y: '31.5vmin', d: '0.18s', t: '0.85s' },
  { x: '-9.5vmin', y: '38.2vmin', d: '0.34s', t: '1.0s' },
  { x: '-6.8vmin', y: '21.5vmin', d: '0.12s', t: '0.77s' },
  { x: '-16.4vmin', y: '22.5vmin', d: '0.34s', t: '0.89s' },
  { x: '-30.8vmin', y: '26.4vmin', d: '0.0s', t: '0.82s' },
  { x: '-27.8vmin', y: '16.8vmin', d: '0.39s', t: '0.89s' },
  { x: '-31.8vmin', y: '18.5vmin', d: '0.31s', t: '0.84s' },
  { x: '-28.2vmin', y: '10.7vmin', d: '0.39s', t: '1.02s' },
  { x: '-27.9vmin', y: '5.8vmin', d: '0.04s', t: '0.77s' },
  { x: '-26.9vmin', y: '-1.2vmin', d: '0.22s', t: '0.91s' },
  { x: '-42.2vmin', y: '-4.1vmin', d: '0.05s', t: '0.98s' },
  { x: '-32.3vmin', y: '-7.6vmin', d: '0.09s', t: '0.84s' },
  { x: '-35.5vmin', y: '-21.0vmin', d: '0.12s', t: '1.06s' },
  { x: '-25.7vmin', y: '-16.2vmin', d: '0.34s', t: '0.97s' },
  { x: '-33.0vmin', y: '-29.0vmin', d: '0.09s', t: '0.84s' },
  { x: '-12.4vmin', y: '-22.4vmin', d: '0.12s', t: '0.78s' },
  { x: '-13.5vmin', y: '-28.0vmin', d: '0.1s', t: '0.96s' },
  { x: '-4.1vmin', y: '-26.9vmin', d: '0.38s', t: '0.92s' },
  { x: '5.0vmin', y: '-35.9vmin', d: '0.07s', t: '0.8s' },
  { x: '15.8vmin', y: '-32.8vmin', d: '0.1s', t: '0.82s' },
  { x: '23.6vmin', y: '-32.9vmin', d: '0.08s', t: '1.08s' },
  { x: '25.7vmin', y: '-22.7vmin', d: '0.17s', t: '0.79s' },
  { x: '33.0vmin', y: '-28.2vmin', d: '0.1s', t: '1.0s' },
  { x: '37.1vmin', y: '-19.9vmin', d: '0.24s', t: '0.85s' },
  { x: '38.3vmin', y: '-13.8vmin', d: '0.03s', t: '0.83s' },
  { x: '45.2vmin', y: '-6.2vmin', d: '0.25s', t: '0.85s' },
];

export default function IntroOverlay() {
  return (
    <div id="mv-intro" aria-hidden="true">
      <div className="mvi-cover" />
      <div className="mvi-dust">
        {DUST.map((p, i) => (
          <i key={i} style={{ '--x': p.x, '--y': p.y, '--d': p.d, '--t': p.t }} />
        ))}
      </div>
      <div className="mvi-flash" />
      <div className="mvi-front" />
      <div className="mvi-lock" id="mvi-lock">
        <div className="mvi-lockin">
          <svg className="mvi-mark" viewBox="0 0 130 190" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mvTop" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#12B6E4" />
                <stop offset="1" stopColor="#4EA8ED" />
              </linearGradient>
              <linearGradient id="mvSideL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#4A93EA" />
                <stop offset="1" stopColor="#38B0E9" />
              </linearGradient>
              <linearGradient id="mvSideR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#4F9CEA" />
                <stop offset="1" stopColor="#5E82E2" />
              </linearGradient>
            </defs>
            <g className="sl sl3" style={{ '--sd': '.25s' }}>
              <g className="fl">
                <path d="M65,94 L130,125 L65,156 L0,125 Z M65,110.7 L95,125 L65,139.3 L35,125 Z" fill="url(#mvTop)" fillRule="evenodd"/>
                <polygon points="0,125 65,156 65,188 0,157" fill="url(#mvSideL)"/>
                <polygon points="65,156 130,125 130,157 65,188" fill="url(#mvSideR)"/>
                <polygon points="35,125 65,110.7 65,125 50,132.15" fill="#8ad2f0"/>
                <polygon points="65,110.7 95,125 80,132.15 65,125" fill="#5fb3ea"/>
                <polygon points="50,132.15 65,125 80,132.15 65,139.3" fill="#050608"/>
              </g>
              <path className="st" d="M65,94 L130,125 L130,157 L65,188 L0,157 L0,125 Z M0,125 L65,156 L130,125 M65,156 L65,188" pathLength="1"/>
              <path className="st st2" d="M65,110.7 L95,125 L65,139.3 L35,125 Z" pathLength="1"/>
            </g>
            <g className="sl sl2" style={{ '--sd': '.43s' }}>
              <g className="fl">
                <path d="M65,47 L130,78 L65,109 L0,78 Z M65,63.7 L95,78 L65,92.3 L35,78 Z" fill="url(#mvTop)" fillRule="evenodd"/>
                <polygon points="0,78 65,109 65,141 0,110" fill="url(#mvSideL)"/>
                <polygon points="65,109 130,78 130,110 65,141" fill="url(#mvSideR)"/>
                <polygon points="35,78 65,63.7 65,78 50,85.15" fill="#8ad2f0"/>
                <polygon points="65,63.7 95,78 80,85.15 65,78" fill="#5fb3ea"/>
                <polygon points="50,85.15 65,78 80,85.15 65,92.3" fill="#050608"/>
              </g>
              <path className="st" d="M65,47 L130,78 L130,110 L65,141 L0,110 L0,78 Z M0,78 L65,109 L130,78 M65,109 L65,141" pathLength="1"/>
              <path className="st st2" d="M65,63.7 L95,78 L65,92.3 L35,78 Z" pathLength="1"/>
            </g>
            
            <g className="sl sl1" style={{ '--sd': '.61s' }}>
              <g className="fl">
                <path d="M65,0 L130,31 L65,62 L0,31 Z M65,16.7 L95,31 L65,45.3 L35,31 Z" fill="url(#mvTop)" fillRule="evenodd"/>
                <polygon points="0,31 65,62 65,94 0,63" fill="url(#mvSideL)"/>
                <polygon points="65,62 130,31 130,63 65,94" fill="url(#mvSideR)"/>
                <polygon points="35,31 65,16.7 65,31 50,38.15" fill="#8ad2f0"/>
                <polygon points="65,16.7 95,31 80,38.15 65,31" fill="#5fb3ea"/>
                <polygon points="50,38.15 65,31 80,38.15 65,45.3" fill="#050608"/>
              </g>
              <path className="st" d="M65,0 L130,31 L130,63 L65,94 L0,63 L0,31 Z M0,31 L65,62 L130,31 M65,62 L65,94" pathLength="1"/>
              <path className="st st2" d="M65,16.7 L95,31 L65,45.3 L35,31 Z" pathLength="1"/>
            </g>
            
          </svg>
          <span className="mvi-word">
            <span className="mvi-row">{'ADVON'.split('').map((c, i) => <i key={i} className="mvi-l" style={{ '--i': i }}>{c}</i>)}</span>
            <span className="mvi-row mvi-row2">{'MEDIA'.split('').map((c, i) => <i key={i} className="mvi-l" style={{ '--i': i + 5 }}>{c}</i>)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
