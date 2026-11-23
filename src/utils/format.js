import { artName } from './artwork'
export const formatPrice = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')
export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const discountPercent = (p) => (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0)
export const imageFor = (kw, lock = 0) => `/art/${artName(kw, lock)}.png`
