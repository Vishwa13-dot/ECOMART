// Browser-side store for images uploaded from the admin panel.
// Images live in IndexedDB (large capacity) instead of localStorage (about 5 MB), and the rest of the
// app refers to them by a short reference such as "media:m_ab12cd". Falls back to memory if IndexedDB is blocked.
const DB = 'ecomart-media'
const STORE = 'images'
const mem = new Map()
let dbPromise = null
export let persistent = true

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'))
      const req = indexedDB.open(DB, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    }).catch((e) => { persistent = false; throw e })
  }
  return dbPromise
}

const run = (mode, fn) => open().then((db) => new Promise((resolve, reject) => {
  const tx = db.transaction(STORE, mode)
  const out = fn(tx.objectStore(STORE))
  tx.oncomplete = () => resolve(out && 'result' in out ? out.result : undefined)
  tx.onerror = tx.onabort = () => reject(tx.error)
}))

export async function loadAll() {
  try {
    const db = await open()
    return await new Promise((resolve, reject) => {
      const out = {}
      const req = db.transaction(STORE).objectStore(STORE).openCursor()
      req.onsuccess = () => { const c = req.result; if (c) { out[c.key] = c.value; c.continue() } else resolve(out) }
      req.onerror = () => reject(req.error)
    })
  } catch { return Object.fromEntries(mem) }
}
export async function putImage(id, dataUrl) {
  mem.set(id, dataUrl)
  try { await run('readwrite', (s) => s.put(dataUrl, id)); return true } catch { return false }
}
export async function deleteImages(ids) {
  ids.forEach((id) => mem.delete(id))
  try { await run('readwrite', (s) => { ids.forEach((id) => s.delete(id)) }) } catch { /* ignore */ }
}
export async function clearImages() {
  mem.clear()
  try { await run('readwrite', (s) => { s.clear() }) } catch { /* ignore */ }
}

// Tell other open tabs (e.g. the storefront while you edit in /admin) to reload the media map.
const chan = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('ecomart-media') : null
export const announce = () => chan?.postMessage('changed')
export const onRemoteChange = (fn) => { chan?.addEventListener('message', fn); return () => chan?.removeEventListener('message', fn) }
