import { useState } from 'react'
import { FiImage } from 'react-icons/fi'

// Renders any image URL with a graceful placeholder. The failure flag is tied to the specific src,
// so changing the image (e.g. after an admin edit) always gets a fresh attempt instead of staying broken.
export default function ProductImage({ src, alt, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-cream text-olive/60 ${className}`} role="img" aria-label={alt}>
        <FiImage size={28} />
      </div>
    )
  }
  return <img src={src} alt={alt} decoding="async" onError={() => setFailedSrc(src)} className={`bg-cream object-cover ${className}`} />
}
