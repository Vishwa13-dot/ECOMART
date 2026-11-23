// Validates and compresses an uploaded image in the browser so it stays small enough to store.
export const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
export const MAX_FILE_MB = 15
export const MAX_GALLERY = 8

export function readImageFile(file, { maxSide = 1400, quality = 0.86 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return reject(new Error(`“${file?.name || 'File'}” is not a JPG, PNG, WebP or GIF image.`))
    if (file.size > MAX_FILE_MB * 1024 * 1024) return reject(new Error(`“${file.name}” is larger than ${MAX_FILE_MB} MB.`))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
        const w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h) // flatten transparency onto white
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch (e) { reject(e) } finally { URL.revokeObjectURL(url) }
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`“${file.name}” could not be read as an image.`)) }
    img.src = url
  })
}

export const isValidUrl = (s) => /^(https?:\/\/|\/)[^\s]+$/i.test(s.trim())
