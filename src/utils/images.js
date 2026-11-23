// Central image system. Every image on the site is resolved in this order:
//   1. an image chosen in Admin (uploaded -> "media:<id>", or a pasted URL)
//   2. a file you dropped into src/assets/images/ (see the README there)
//   3. the built-in fallback artwork
// No page or component hardcodes an image path; they all go through the helpers below.
import { imageFor } from './format'

// ---- 2. files dropped into src/assets/images (auto-discovered at build time, no code edits needed)
const files = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' })
const fileProducts = {}, fileCategories = {}, fileSite = {}
Object.entries(files).forEach(([path, url]) => {
  const parts = path.split('/images/')[1].split('/')
  const base = parts[parts.length - 1].replace(/\.[^.]+$/, '')
  if (parts[0] === 'products' && parts.length === 3) (fileProducts[parts[1]] ||= []).push([base, url])
  else if (parts[0] === 'categories' && parts.length === 2) fileCategories[base] = url
  else if (parts[0] === 'site' && parts.length === 2) fileSite[base] = url
})
Object.keys(fileProducts).forEach((id) => {
  fileProducts[id] = fileProducts[id].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true })).map((x) => x[1])
})

// ---- site-wide image slots (hero banner, story photos...). Add a slot here and it appears in Admin > Images.
export const SITE_SLOTS = [
  { key: 'hero', label: 'Home page hero banner', where: 'Top of the home page', ratio: '4:5 portrait', kw: 'plants,home,interior', seed: 77, alt: 'A bright home corner with plants and natural-material objects' },
  { key: 'home-story', label: 'Home page “Sustainability” photo', where: 'Home page, beside the sustainability text', ratio: '5:4 landscape', kw: 'workshop,craft,handmade', seed: 555, alt: 'A maker working with natural materials in a small workshop' },
  { key: 'about-story', label: 'About page photo', where: 'About page, beside “Our story”', ratio: '4:3 landscape', kw: 'artisan,workshop,hands', seed: 620, alt: 'Artisan hands at work' },
  { key: 'auth', label: 'Login & register side photo', where: 'Left panel of the login and register pages', ratio: 'tall portrait', kw: 'greenery,plants,window', seed: 310, alt: 'Plants by a sunny window' },
]
export const slotByKey = (key) => SITE_SLOTS.find((s) => s.key === key)

export const MEDIA_PREFIX = 'media:'
export const isMediaRef = (ref) => typeof ref === 'string' && ref.startsWith(MEDIA_PREFIX)
export const mediaId = (ref) => ref.slice(MEDIA_PREFIX.length)

// ---- defaults for each kind of image (file override first, then fallback artwork)
export function defaultSiteRef(key) {
  const s = slotByKey(key)
  return fileSite[key] || (s ? imageFor(s.kw, s.seed) : '')
}
export function defaultCategoryRef(cat) {
  return fileCategories[cat.id] || imageFor(cat.kw || 'eco,product', 900)
}
export function defaultProductRefs(product, seedProduct) {
  if (fileProducts[product.id]?.length) return fileProducts[product.id]
  return (seedProduct?.images?.length ? seedProduct.images : product.images) || []
}
export const hasFileOverride = {
  product: (id) => !!fileProducts[id]?.length,
  category: (id) => !!fileCategories[id],
  site: (key) => !!fileSite[key],
}
