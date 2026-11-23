import { useEffect, useState } from 'react'

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw)
    } catch { /* ignore */ }
    return typeof initial === 'function' ? initial() : initial
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { window.dispatchEvent(new Event('ecomart:storage-error')) }
  }, [key, value])
  // Keep other open tabs (e.g. storefront while editing in /admin) in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.newValue === null) return
      try { setValue(JSON.parse(e.newValue)) } catch { /* ignore */ }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])
  return [value, setValue]
}
