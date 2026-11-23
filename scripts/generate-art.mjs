// Optional: regenerates public/art/*.png. Needs `npm i -D sharp` (not required to run the site).
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'
import { artSvg, MOTIF_COUNT, TONE_COUNT, OBJ_COUNT } from '../src/utils/artwork.js'

mkdirSync('public/art', { recursive: true })
let n = 0
for (let m = 0; m < MOTIF_COUNT; m++) for (let t = 0; t < TONE_COUNT; t++) for (let o = 0; o < OBJ_COUNT; o++) for (let f = 0; f < 2; f++) {
  const png = await sharp(Buffer.from(artSvg(m, t, o, f))).resize(640, 640).png({ compressionLevel: 9, palette: true }).toBuffer()
  writeFileSync(`public/art/${m}-${t}-${o}-${f}.png`, png); n++
}
console.log(`generated ${n} images`)
