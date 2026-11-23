import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, discountPercent } from '../utils/format'
import ProductImage from './ProductImage'
import WishlistButton from './WishlistButton'
import AddToCartButton from './AddToCartButton'
import Stars from './Stars'

const isNew = (p) => Date.now() - new Date(p.createdAt).getTime() < 45 * 864e5

export default function ProductCard({ product: p }) {
  const { categories, ratingFor } = useStore()
  const cat = categories.find((c) => c.id === p.cat)
  const { avg, count } = ratingFor(p.id)
  const off = discountPercent(p)
  return (
    <article className="group relative flex h-full flex-col">
      <Link to={`/product/${p.id}`} className="relative block overflow-hidden bg-cream">
        <ProductImage src={p.images[0]} alt={p.name} className="aspect-square w-full transition duration-700 ease-out group-hover:scale-[1.06]" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="bg-olive px-2 py-1 text-xs font-medium text-white">{off}% off</span>}
          {isNew(p) && <span className="bg-white px-2 py-1 text-xs font-medium text-ink">New</span>}
        </div>
        <WishlistButton
          id={p.id}
          className="absolute right-3 top-3 h-9 w-9 bg-white/90 text-ink shadow-soft hover:text-olive md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full transition duration-300 ease-out group-hover:translate-y-0 md:block">
          <AddToCartButton id={p.id} label="Quick add" className="btn w-full rounded-none bg-white/95 text-ink hover:bg-olive hover:text-white" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-ink/55">{cat?.name}</p>
        <Link to={`/product/${p.id}`} className="mt-1 text-[15px] font-medium leading-snug transition hover:text-olive">{p.name}</Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/60">
          {count > 0 ? <><Stars value={avg} size={12} /><span>({count})</span></> : <span>No reviews yet</span>}
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-medium">{formatPrice(p.price)}</span>
          {p.oldPrice && <span className="text-sm text-ink/45 line-through">{formatPrice(p.oldPrice)}</span>}
        </div>
        <AddToCartButton id={p.id} className="btn-outline btn-sm mt-3 md:hidden" />
      </div>
    </article>
  )
}
