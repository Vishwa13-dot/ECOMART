import { useEffect, useState } from 'react'
import { FiCheck, FiShoppingBag } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'

export default function AddToCartButton({ id, qty = 1, className = 'btn-primary', label = 'Add to cart', onAdded }) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  useEffect(() => { if (!added) return; const t = setTimeout(() => setAdded(false), 1400); return () => clearTimeout(t) }, [added])
  return (
    <button
      type="button" className={className}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(id, qty); setAdded(true); onAdded?.() }}
    >
      {added ? <FiCheck className="animate-pop" /> : <FiShoppingBag />}
      <span>{added ? 'Added' : label}</span>
    </button>
  )
}
