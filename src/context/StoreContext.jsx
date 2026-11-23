import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { seedProducts, seedReviews } from '../data/products'
import { categories as seedCategories } from '../data/categories'
import { seedOrders, seedUsers, seedSellerApps } from '../data/seed'
import { uid } from '../utils/format'
import { loadAll, putImage, deleteImages, clearImages, announce, onRemoteChange } from '../utils/mediaStore'
import { MEDIA_PREFIX, isMediaRef, mediaId, defaultSiteRef, defaultCategoryRef, defaultProductRefs, hasFileOverride } from '../utils/images'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export const FREE_DELIVERY_ABOVE = 999
export const DELIVERY_FEE = 79
const V = 'v2' // bump to reset stored demo data

export function StoreProvider({ children }) {
  const [rawProducts, setProducts] = useLocalStorage(`ecomart.${V}.products`, seedProducts)
  const [rawCategories, setCategories] = useLocalStorage(`ecomart.${V}.categories`, seedCategories)
  const [siteImages, setSiteImages] = useLocalStorage(`ecomart.${V}.siteImages`, {}) // slot key -> image reference
  const [reviews, setReviews] = useLocalStorage(`ecomart.${V}.reviews`, seedReviews)
  const [cart, setCart] = useLocalStorage(`ecomart.${V}.cart`, [])
  const [wishlist, setWishlist] = useLocalStorage(`ecomart.${V}.wishlist`, [])
  const [orders, setOrders] = useLocalStorage(`ecomart.${V}.orders`, seedOrders)
  const [users, setUsers] = useLocalStorage(`ecomart.${V}.users`, seedUsers)
  const [currentUser, setCurrentUser] = useLocalStorage(`ecomart.${V}.session`, null)
  const [sellerApps, setSellerApps] = useLocalStorage(`ecomart.${V}.sellerApps`, seedSellerApps)
  const [messages, setMessages] = useLocalStorage(`ecomart.${V}.messages`, [])
  const [toasts, setToasts] = useState([])
  const [media, setMedia] = useState({}) // uploaded images (IndexedDB), id -> data URL
  const [mediaReady, setMediaReady] = useState(false)

  const notify = useCallback((message, type = 'success') => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  // ---- images: one place that turns stored references into URLs the whole site renders
  useEffect(() => {
    const h = () => notify('Your browser could not save the latest changes (storage may be full or blocked).', 'error')
    window.addEventListener('ecomart:storage-error', h)
    return () => window.removeEventListener('ecomart:storage-error', h)
  }, [notify])

  useEffect(() => {
    let alive = true
    const load = () => loadAll().then((m) => { if (alive) { setMedia(m); setMediaReady(true) } })
    load()
    const off = onRemoteChange(load) // another tab uploaded or removed an image
    return () => { alive = false; off() }
  }, [])

  const resolveImage = useCallback((ref) => (isMediaRef(ref) ? media[mediaId(ref)] || '' : ref || ''), [media])
  const seedById = useMemo(() => Object.fromEntries(seedProducts.map((p) => [p.id, p])), [])
  const hasCustomImages = (p) => {
    if (p.customImages !== undefined) return p.customImages
    const s = seedById[p.id]
    return !s || (p.images || []).join('|') !== s.images.join('|') // edited before this flag existed
  }
  const defaultImagesFor = (p) => (seedById[p.id] || hasFileOverride.product(p.id) ? defaultProductRefs(p, seedById[p.id]) : []) // dropped-in files, else built-in artwork; [] for new products
  const productRefs = (p) => (hasCustomImages(p) ? p.images || [] : defaultImagesFor(p))

  // Storefront and admin both read these: `images` are ready-to-render URLs, `imageRefs` are what the admin edits.
  const products = useMemo(() => rawProducts.map((p) => {
    const refs = productRefs(p)
    return { ...p, imageRefs: refs, images: refs.map(resolveImage), hasCustomImages: hasCustomImages(p) }
  }), [rawProducts, resolveImage]) // eslint-disable-line react-hooks/exhaustive-deps
  const categories = useMemo(() => rawCategories.map((c) => {
    const ref = c.image || defaultCategoryRef(c)
    return { ...c, imageRef: ref, imageUrl: resolveImage(ref), hasCustomImage: !!c.image }
  }), [rawCategories, resolveImage])
  const siteImage = useCallback((key) => resolveImage(siteImages[key] || defaultSiteRef(key)), [siteImages, resolveImage])

  const latest = useRef({})
  latest.current = { rawProducts, rawCategories, siteImages, media }
  // Delete uploaded images nothing refers to any more (run after admin changes, in the tab that made them).
  const pruneMedia = useCallback(() => setTimeout(() => {
    const { rawProducts: ps, rawCategories: cs, siteImages: si, media: m } = latest.current
    const used = new Set()
    const add = (r) => isMediaRef(r) && used.add(mediaId(r))
    ps.forEach((p) => (p.images || []).forEach(add)); cs.forEach((c) => add(c.image)); Object.values(si).forEach(add)
    const orphans = Object.keys(m).filter((id) => !used.has(id))
    if (!orphans.length) return
    setMedia((x) => { const n = { ...x }; orphans.forEach((id) => delete n[id]); return n })
    deleteImages(orphans).then(announce)
  }, 600), [])

  const addMedia = (dataUrl) => {
    const id = uid('m')
    setMedia((m) => ({ ...m, [id]: dataUrl }))
    putImage(id, dataUrl).then((ok) => { if (!ok) notify('Image shown now, but your browser blocked saving it permanently.', 'error'); announce() })
    return MEDIA_PREFIX + id
  }

  const productById = useCallback((id) => products.find((p) => p.id === id), [products])

  const ratings = useMemo(() => {
    const map = {}
    reviews.forEach((r) => {
      const m = (map[r.productId] ||= { sum: 0, count: 0 })
      m.sum += r.rating
      m.count += 1
    })
    Object.keys(map).forEach((k) => { map[k] = { avg: map[k].sum / map[k].count, count: map[k].count } })
    return map
  }, [reviews])
  const ratingFor = (id) => ratings[id] || { avg: 0, count: 0 }

  // ---- cart
  const addToCart = (id, qty = 1) => {
    const p = productById(id)
    setCart((c) => {
      const found = c.find((i) => i.id === id)
      return found ? c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 20) } : i)) : [...c, { id, qty }]
    })
    if (p) notify(`${p.name} added to cart`)
  }
  const updateQty = (id, qty) => {
    if (qty < 1) return
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i)))
  }
  const removeFromCart = (id) => { setCart((c) => c.filter((i) => i.id !== id)); notify('Removed from cart', 'info') }
  const clearCart = () => setCart([])

  const cartItems = useMemo(
    () => cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((i) => i.product),
    [cart, products]
  )
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0)
  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  // ---- wishlist
  const isWished = (id) => wishlist.includes(id)
  const toggleWishlist = (id) => {
    const had = wishlist.includes(id)
    setWishlist((w) => (had ? w.filter((x) => x !== id) : [...w, id]))
    notify(had ? 'Removed from wishlist' : 'Saved to wishlist', had ? 'info' : 'success')
  }
  const moveToCart = (id) => {
    addToCart(id, 1)
    setWishlist((w) => w.filter((x) => x !== id))
  }

  // ---- orders
  const placeOrder = (customer, payment) => {
    const order = {
      id: 'EM' + String(Math.floor(10000 + Math.random() * 89999)),
      date: new Date().toISOString(),
      status: 'Processing',
      payment,
      customer,
      items: cartItems.map((i) => ({ id: i.id, name: i.product.name, price: i.product.price, qty: i.qty })),
      subtotal, delivery, total,
    }
    setOrders((o) => [order, ...o])
    setProducts((ps) => ps.map((p) => { const l = order.items.find((i) => i.id === p.id); return l ? { ...p, sold: (p.sold || 0) + l.qty } : p }))
    clearCart()
    return order
  }
  const setOrderStatus = (id, status) => { setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x))); notify(`Order ${id} marked ${status}`) }

  // ---- auth
  const login = (email, password) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
    if (!u) return { ok: false, error: 'Email or password is incorrect.' }
    const { password: _pw, ...safe } = u
    setCurrentUser(safe)
    notify(`Welcome back, ${u.name.split(' ')[0]}`)
    return { ok: true, user: safe }
  }
  const register = ({ name, email, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, error: 'An account with this email already exists.' }
    const u = { id: uid('u'), name: name.trim(), email: email.trim(), password, role: 'customer', joined: new Date().toISOString() }
    setUsers((x) => [...x, u])
    const { password: _pw, ...safe } = u
    setCurrentUser(safe)
    notify('Account created. Welcome to EcoMart')
    return { ok: true, user: safe }
  }
  const logout = () => { setCurrentUser(null); notify('Signed out', 'info') }

  // ---- reviews
  const addReview = (r) => { setReviews((x) => [{ id: uid('r'), date: new Date().toISOString(), ...r }, ...x]); notify('Thanks for your review') }
  const deleteReview = (id) => { setReviews((x) => x.filter((r) => r.id !== id)); notify('Review deleted', 'info') }

  // ---- admin: products
  const saveProduct = (input) => {
    // `images` holds image references; customImages=false means "use the default / dropped-in files"
    const { imageRefs, hasCustomImages: _h, ...p } = input
    setProducts((ps) => (ps.some((x) => x.id === p.id) ? ps.map((x) => (x.id === p.id ? p : x)) : [p, ...ps]))
    notify('Product saved')
    pruneMedia()
  }
  const deleteProduct = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id))
    pruneMedia()
    setCart((c) => c.filter((i) => i.id !== id))
    setWishlist((w) => w.filter((x) => x !== id))
    notify('Product deleted', 'info')
  }
  // ---- admin: categories
  const saveCategory = (input) => {
    const { imageRef, imageUrl, hasCustomImage, ...c } = input
    if (!c.image) delete c.image
    setCategories((cs) => (cs.some((x) => x.id === c.id) ? cs.map((x) => (x.id === c.id ? c : x)) : [...cs, c]))
    notify('Category saved')
    pruneMedia()
  }
  const deleteCategory = (id) => {
    if (products.some((p) => p.cat === id)) { notify('Move or delete this category\u2019s products first', 'error'); return }
    setCategories((cs) => cs.filter((c) => c.id !== id))
    notify('Category deleted', 'info')
    pruneMedia()
  }
  // ---- admin: site-wide images (hero, story photos...) and a global reset
  const setSiteImage = (key, ref) => {
    setSiteImages((m) => { const n = { ...m }; if (ref) n[key] = ref; else delete n[key]; return n })
    notify(ref ? 'Image updated' : 'Image reset to default')
    pruneMedia()
  }
  const resetAllImages = () => {
    setSiteImages({})
    setCategories((cs) => cs.map(({ image, ...c }) => c))
    setProducts((ps) => ps.map((p) => (seedById[p.id] ? { ...p, images: seedById[p.id].images, customImages: false } : p)))
    setMedia({}); clearImages().then(announce)
    notify('All images reset to defaults', 'info')
  }

  // ---- sellers & contact
  const submitSellerApp = (a) => { setSellerApps((x) => [{ id: uid('sa'), status: 'Pending', date: new Date().toISOString(), ...a }, ...x]) }
  const setSellerStatus = (id, status) => { setSellerApps((x) => x.map((a) => (a.id === id ? { ...a, status } : a))); notify(`Application ${status.toLowerCase()}`) }
  const submitMessage = (m) => setMessages((x) => [{ id: uid('m'), date: new Date().toISOString(), ...m }, ...x])

  const value = {
    products, categories, reviews, cart, cartItems, cartCount, subtotal, delivery, total,
    wishlist, orders, users, currentUser, sellerApps, messages, toasts,
    notify, productById, ratingFor, addToCart, updateQty, removeFromCart, clearCart,
    isWished, toggleWishlist, moveToCart, placeOrder, setOrderStatus,
    login, register, logout, addReview, deleteReview,
    saveProduct, deleteProduct, saveCategory, deleteCategory,
    resolveImage, addMedia, defaultImagesFor, siteImage, siteImages, setSiteImage, resetAllImages, mediaReady, mediaCount: Object.keys(media).length,
    submitSellerApp, setSellerStatus, submitMessage,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
