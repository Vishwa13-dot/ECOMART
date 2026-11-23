import { useRef, useState } from 'react'
import { FiUpload, FiLink, FiTrash2, FiRefreshCw, FiArrowLeft, FiArrowRight, FiCheck, FiX, FiRotateCcw } from 'react-icons/fi'
import ProductImage from './ProductImage'
import { ACCEPT, MAX_GALLERY, readImageFile, isValidUrl } from '../utils/imageFile'

// Manages every image of a product: add several at once (or drag files in), replace, remove, reorder, preview.
// `items` = [{ key, src }] where src is the URL being previewed; `pending` items carry { dataUrl } / { url } until Save.
export default function ProductGalleryEditor({ items, onChange, onRestoreDefaults, canRestore, error, folderHint }) {
  const fileInput = useRef(null)
  const replaceInput = useRef(null)
  const replaceIndex = useRef(null)
  const dragFrom = useRef(null)
  const [overIndex, setOverIndex] = useState(null)
  const [url, setUrl] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const newKey = () => `k${Math.random().toString(36).slice(2, 9)}`
  const room = MAX_GALLERY - items.length

  const addFiles = async (fileList) => {
    const files = [...(fileList || [])]
    if (!files.length) return
    setBusy(true); setMsg('')
    const added = [], problems = []
    for (const f of files.slice(0, Math.max(room, 0))) {
      try { const dataUrl = await readImageFile(f); added.push({ key: newKey(), src: dataUrl, pending: { dataUrl } }) } catch (e) { problems.push(e.message) }
    }
    if (files.length > room) problems.push(`Only ${MAX_GALLERY} images per product. ${files.length - Math.max(room, 0)} skipped.`)
    if (added.length) onChange([...items, ...added])
    setMsg(problems.join(' ')); setBusy(false)
    if (fileInput.current) fileInput.current.value = ''
  }
  const replaceFile = async (file) => {
    const i = replaceIndex.current
    if (file == null || i == null) return
    setBusy(true); setMsg('')
    try {
      const dataUrl = await readImageFile(file)
      onChange(items.map((it, n) => (n === i ? { key: it.key, src: dataUrl, pending: { dataUrl } } : it)))
    } catch (e) { setMsg(e.message) }
    setBusy(false); replaceIndex.current = null
    if (replaceInput.current) replaceInput.current.value = ''
  }
  const addUrl = () => {
    if (!isValidUrl(url)) { setMsg('Enter a full image address starting with https:// (or a /path on this site).'); return }
    if (room <= 0) { setMsg(`Only ${MAX_GALLERY} images per product.`); return }
    onChange([...items, { key: newKey(), src: url.trim(), pending: { url: url.trim() } }])
    setUrl(''); setShowUrl(false); setMsg('')
  }
  const remove = (i) => onChange(items.filter((_, n) => n !== i))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const drop = (to) => {
    const from = dragFrom.current
    dragFrom.current = null; setOverIndex(null)
    if (from == null || from === to) return
    const next = [...items]; const [m] = next.splice(from, 1); next.splice(to, 0, m)
    onChange(next)
  }

  return (
    <fieldset className="sm:col-span-2" aria-describedby="gallery-help">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <legend className="label !mb-0">Product images <span className="font-normal text-ink/55">({items.length}/{MAX_GALLERY})</span></legend>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInput} type="file" accept={ACCEPT} multiple className="sr-only" aria-label="Choose product images" onChange={(e) => addFiles(e.target.files)} />
          <input ref={replaceInput} type="file" accept={ACCEPT} className="sr-only" aria-label="Choose replacement image" onChange={(e) => replaceFile(e.target.files?.[0])} />
          <button type="button" className="btn-outline btn-sm" disabled={room <= 0 || busy} onClick={() => fileInput.current?.click()}><FiUpload /> Upload images</button>
          <button type="button" className="btn-outline btn-sm" disabled={room <= 0} onClick={() => setShowUrl((v) => !v)}><FiLink /> Add by URL</button>
          {canRestore && <button type="button" className="btn-outline btn-sm" onClick={onRestoreDefaults}><FiRotateCcw /> Restore default images</button>}
        </div>
      </div>
      <p id="gallery-help" className="mt-1 text-xs text-ink/55">The first image is the main photo (product cards, cart, search). Drag thumbnails or use the arrows to reorder. Changes appear on the site when you press Save product.</p>
      {showUrl && (
        <div className="mt-2 flex gap-2">
          <input className="input !py-2" placeholder="https://…/photo.jpg" aria-label="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }} />
          <button type="button" className="btn-primary btn-sm" onClick={addUrl} aria-label="Add URL"><FiCheck /></button>
          <button type="button" className="btn-outline btn-sm" onClick={() => setShowUrl(false)} aria-label="Cancel"><FiX /></button>
        </div>
      )}

      <div
        className="mt-3 grid grid-cols-2 gap-3 border border-dashed border-sand bg-white p-3 sm:grid-cols-4"
        onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) e.preventDefault() }}
        onDrop={(e) => { if (e.dataTransfer.files?.length) { e.preventDefault(); addFiles(e.dataTransfer.files) } }}
      >
        {items.map((it, i) => (
          <div
            key={it.key}
            draggable
            onDragStart={() => { dragFrom.current = i }}
            onDragOver={(e) => { if (dragFrom.current != null) { e.preventDefault(); setOverIndex(i) } }}
            onDragEnd={() => { dragFrom.current = null; setOverIndex(null) }}
            onDrop={(e) => { if (dragFrom.current != null) { e.preventDefault(); e.stopPropagation(); drop(i) } }}
            className={`group relative cursor-grab border bg-ivory ${overIndex === i ? 'border-olive ring-1 ring-olive' : 'border-sand'}`}
          >
            <ProductImage src={it.src} alt={`Product image ${i + 1}`} className="aspect-square w-full" />
            <span className={`absolute left-1.5 top-1.5 px-1.5 py-0.5 text-[11px] text-white ${i === 0 ? 'bg-olive' : 'bg-ink/70'}`}>{i === 0 ? 'Main' : i + 1}</span>
            {it.pending && <span className="absolute right-1.5 top-1.5 bg-white px-1.5 py-0.5 text-[11px] text-ink shadow-soft">Unsaved</span>}
            <div className="flex items-center justify-between gap-1 border-t border-sand bg-white p-1">
              <div className="flex">
                <button type="button" className="p-1.5 text-ink/60 hover:text-olive disabled:opacity-25" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move image ${i + 1} earlier`}><FiArrowLeft size={15} /></button>
                <button type="button" className="p-1.5 text-ink/60 hover:text-olive disabled:opacity-25" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move image ${i + 1} later`}><FiArrowRight size={15} /></button>
              </div>
              <div className="flex">
                <button type="button" className="p-1.5 text-ink/60 hover:text-olive" onClick={() => { replaceIndex.current = i; replaceInput.current?.click() }} aria-label={`Replace image ${i + 1}`}><FiRefreshCw size={15} /></button>
                <button type="button" className="p-1.5 text-ink/60 hover:text-red-600" onClick={() => remove(i)} aria-label={`Remove image ${i + 1}`}><FiTrash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {room > 0 && (
          <button type="button" onClick={() => fileInput.current?.click()} className="flex aspect-square min-h-[8rem] flex-col items-center justify-center gap-1 border border-dashed border-ink/25 text-xs text-ink/55 transition hover:border-olive hover:text-olive sm:aspect-auto">
            <FiUpload size={18} /> {items.length ? 'Add more' : 'Drop images here or click to upload'}
          </button>
        )}
      </div>
      {busy && <p className="mt-1.5 text-xs text-ink/60" role="status">Processing images…</p>}
      {(msg || error) && <p className="mt-1.5 text-xs text-red-600" role="alert">{msg || error}</p>}
      {folderHint && <p className="mt-1.5 text-xs text-ink/45">{folderHint}</p>}
    </fieldset>
  )
}
