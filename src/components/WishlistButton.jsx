import { useEffect, useState } from 'react'
import { FiHeart } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'

export default function WishlistButton({ id, className = '', withLabel = false }) {
  const { isWished, toggleWishlist } = useStore()
  const wished = isWished(id)
  const [pop, setPop] = useState(false)
  useEffect(() => { if (!pop) return; const t = setTimeout(() => setPop(false), 450); return () => clearTimeout(t) }, [pop])
  return (
    <button
      type="button" aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); setPop(true) }}
      className={`inline-flex items-center justify-center gap-2 transition ${className}`}
    >
      <FiHeart className={`${pop ? 'animate-pop' : ''} ${wished ? 'fill-olive text-olive' : ''}`} />
      {withLabel && <span>{wished ? 'Saved to wishlist' : 'Add to wishlist'}</span>}
    </button>
  )
}
