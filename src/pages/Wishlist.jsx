import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import PageHeader from '../components/PageHeader'
import ProductImage from '../components/ProductImage'

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, moveToCart } = useStore()
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  return (
    <>
      <PageHeader title="Wishlist">{items.length ? `${items.length} saved item${items.length > 1 ? 's' : ''}.` : 'Save things you like and come back to them later.'}</PageHeader>
      <div className="container-x py-10">
        {items.length === 0 ? (
          <div className="py-16 text-center"><p className="text-ink/65">Your wishlist is empty. Tap the heart on any product to save it here.</p><Link to="/shop" className="btn-primary mt-6">Browse products</Link></div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.id} className="flex animate-fade-in gap-4 border border-sand bg-white p-3">
                <Link to={`/product/${p.id}`} className="h-28 w-28 shrink-0 overflow-hidden"><ProductImage src={p.images[0]} alt={p.name} className="h-full w-full" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to={`/product/${p.id}`} className="text-sm font-medium leading-snug hover:text-olive">{p.name}</Link>
                  <p className="mt-1 text-sm">{formatPrice(p.price)}</p>
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <button onClick={() => moveToCart(p.id)} className="btn-primary btn-sm">Move to cart</button>
                    <button onClick={() => toggleWishlist(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="p-2 text-ink/50 transition hover:text-red-600"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
