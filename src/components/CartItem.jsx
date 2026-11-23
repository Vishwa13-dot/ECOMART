import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import ProductImage from './ProductImage'

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useStore()
  const p = item.product
  return (
    <div className="flex gap-4 border-b border-sand py-5 animate-fade-in">
      <Link to={`/product/${p.id}`} className="h-24 w-24 shrink-0 overflow-hidden bg-cream sm:h-28 sm:w-28">
        <ProductImage src={p.images[0]} alt={p.name} className="h-full w-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${p.id}`} className="font-medium leading-snug hover:text-olive">{p.name}</Link>
            <p className="mt-0.5 text-xs text-ink/55">Sold by {p.seller.name}</p>
          </div>
          <p className="font-medium">{formatPrice(p.price * item.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center border border-sand bg-white">
            <button aria-label="Decrease quantity" className="p-2.5 hover:text-olive disabled:opacity-30" disabled={item.qty <= 1} onClick={() => updateQty(p.id, item.qty - 1)}><FiMinus size={14} /></button>
            <span className="w-9 text-center text-sm" aria-live="polite">{item.qty}</span>
            <button aria-label="Increase quantity" className="p-2.5 hover:text-olive" onClick={() => updateQty(p.id, item.qty + 1)}><FiPlus size={14} /></button>
          </div>
          <button onClick={() => removeFromCart(p.id)} className="flex items-center gap-1.5 text-sm text-ink/55 transition hover:text-red-600"><FiTrash2 size={15} /> Remove</button>
        </div>
      </div>
    </div>
  )
}
