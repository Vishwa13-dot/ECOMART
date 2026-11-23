import { useRef, useState } from 'react'
import { FiUpload, FiLink, FiRotateCcw, FiCheck, FiX } from 'react-icons/fi'
import ProductImage from './ProductImage'
import { ACCEPT, readImageFile, isValidUrl } from '../utils/imageFile'

// Admin control for ONE image: live preview, upload/replace, paste a URL, reset to default.
// `value` is the preview URL currently shown; nothing is saved until the parent saves (onChange gives a pending image).
export default function ImagePicker({ preview, ratio = 'aspect-[4/3]', note, onPick, onReset, resetLabel = 'Reset to default', isCustom, busyLabel }) {
  const input = useRef(null)
  const [url, setUrl] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const pickFile = async (file) => {
    if (!file) return
    setBusy(true); setError('')
    try { onPick({ dataUrl: await readImageFile(file) }) } catch (e) { setError(e.message) } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  const applyUrl = () => {
    if (!isValidUrl(url)) { setError('Enter a full image address starting with https:// (or a /path on this site).'); return }
    setError(''); onPick({ url: url.trim() }); setUrl(''); setShowUrl(false)
  }

  return (
    <div>
      <div
        className={`relative overflow-hidden border border-sand bg-cream ${ratio}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]) }}
      >
        <ProductImage src={preview} alt="Preview" className="h-full w-full" />
        {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm">{busyLabel || 'Processing…'}</div>}
        {isCustom && <span className="absolute left-2 top-2 bg-olive px-2 py-0.5 text-[11px] text-white">Custom</span>}
      </div>
      {note && <p className="mt-1.5 text-xs text-ink/55">{note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <input ref={input} type="file" accept={ACCEPT} className="sr-only" aria-label="Choose image file" onChange={(e) => pickFile(e.target.files?.[0])} />
        <button type="button" className="btn-outline btn-sm" onClick={() => input.current?.click()}><FiUpload /> {preview ? 'Replace image' : 'Upload image'}</button>
        <button type="button" className="btn-outline btn-sm" onClick={() => setShowUrl((v) => !v)}><FiLink /> Use URL</button>
        {onReset && <button type="button" className="btn-outline btn-sm" onClick={onReset} disabled={!isCustom}><FiRotateCcw /> {resetLabel}</button>}
      </div>
      {showUrl && (
        <div className="mt-2 flex gap-2">
          <input className="input !py-2" placeholder="https://…/photo.jpg" aria-label="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyUrl() } }} />
          <button type="button" className="btn-primary btn-sm" onClick={applyUrl} aria-label="Apply URL"><FiCheck /></button>
          <button type="button" className="btn-outline btn-sm" onClick={() => { setShowUrl(false); setError('') }} aria-label="Cancel"><FiX /></button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  )
}
