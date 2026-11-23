// Product artwork: warm, minimal illustrations. The SVG builder is used by scripts/generate-art.mjs
// to create static PNGs in public/art/. The app itself only references those files.
const TONES = [['#F1E8DA', '#E5D8C5'], ['#E5D8C5', '#D8C7AE'], ['#EFE7D6', '#DDE1D0'], ['#F1E8DA', '#D9CDB6'], ['#E9DFCB', '#CFC3A8']]
const OBJ = [['#667255', '#8A9677'], ['#B79F7A', '#D2BE9C'], ['#8A9677', '#A9B396'], ['#4F5A41', '#667255'], ['#C9B48F', '#E0CFAF']]

const hash = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }

const leaf = (a, b) => `<path d="M350 540 C350 430 352 340 350 230" stroke="${a}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
  [[-55, 330, 0.9], [55, 300, 0.9], [-50, 410, 1], [52, 390, 1], [0, 215, 0.8]].map(([r, y, s]) => {
    const cx = 350 + (r === 0 ? 0 : r > 0 ? 62 : -62)
    return `<ellipse cx="${cx}" cy="${y}" rx="${30 * s}" ry="${74 * s}" fill="${r === 0 ? b : a}" transform="rotate(${r} ${cx} ${y})"/>`
  }).join('')

const motifs = [
  (a, b) => `<rect x="262" y="228" width="176" height="34" rx="6" fill="${b}"/><rect x="270" y="258" width="160" height="230" rx="16" fill="${a}"/><rect x="292" y="320" width="116" height="80" rx="4" fill="#FAF7F2" opacity="0.6"/>`,
  (a, b) => `<rect x="315" y="196" width="70" height="30" rx="5" fill="${b}"/><rect x="326" y="224" width="48" height="76" fill="${a}"/><rect x="284" y="292" width="132" height="240" rx="34" fill="${a}"/><rect x="300" y="360" width="100" height="90" rx="4" fill="#FAF7F2" opacity="0.6"/>`,
  leaf,
  (a, b) => `<path d="M290 310 C290 200 410 200 410 310" stroke="${b}" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="226" y="300" width="248" height="250" rx="6" fill="${a}"/><rect x="226" y="300" width="248" height="46" fill="${b}" opacity="0.55"/>`,
  (a, b) => `<rect x="250" y="250" width="200" height="30" rx="8" fill="${b}"/><path d="M262 280 L438 280 L416 520 L284 520 Z" fill="#FAF7F2"/><path d="M270 350 L430 350 L422 450 L278 450 Z" fill="${a}"/>`,
  (a, b) => `<rect x="248" y="226" width="206" height="300" rx="8" fill="${a}"/><rect x="248" y="226" width="26" height="300" fill="${b}"/><rect x="300" y="290" width="110" height="10" fill="#FAF7F2" opacity="0.7"/><rect x="300" y="316" width="76" height="10" fill="#FAF7F2" opacity="0.5"/>`,
]

export const MOTIF_COUNT = motifs.length
export const TONE_COUNT = TONES.length
export const OBJ_COUNT = OBJ.length

// Deterministic file name for a (keywords, seed) pair, e.g. "2-4-1-0"
export function artName(key, seed = 0) {
  const h = hash(key)
  return `${h % motifs.length}-${(h + seed) % TONES.length}-${(h >>> 3) % OBJ.length}-${seed % 2}`
}

export function artSvg(m, t, o, flip) {
  const [bg1, bg2] = TONES[t]
  const [a, b] = OBJ[o]
  const sunX = 200 + ((m * 53 + t * 71) % 300)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
<rect width="700" height="700" fill="url(#g)"/>
<circle cx="${sunX}" cy="190" r="118" fill="#FAF7F2" opacity="0.45"/>
<rect y="540" width="700" height="160" fill="#292923" opacity="0.04"/>
<ellipse cx="350" cy="545" rx="150" ry="13" fill="#292923" opacity="0.1"/>
<g transform="${flip ? 'translate(700 0) scale(-1 1)' : ''}">${motifs[m](a, b)}</g>
</svg>`
}
