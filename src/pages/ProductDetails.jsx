import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiMinus, FiPlus, FiMapPin, FiChevronRight } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { formatPrice, discountPercent } from '../utils/format'
import ProductImage from '../components/ProductImage'
import AddToCartButton from '../components/AddToCartButton'
import WishlistButton from '../components/WishlistButton'
import EcoInfo from '../components/EcoInfo'
import ReviewsSection from '../components/ReviewsSection'
import ProductGrid from '../components/ProductGrid'
import Stars from '../components/Stars'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'

export default function ProductDetails() {
  const { id } = useParams()
  const { productById, products, categories, ratingFor } = useStore()
  const p = productById(id)
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)
  useEffect(() => { setImg(0); setQty(1) }, [id])
  if (!p) return <NotFound message="We couldn’t find that product. It may have been removed." />

  const cur = Math.min(img, Math.max(p.images.length - 1, 0)) // gallery may shrink after an admin edit
  const cat = categories.find((c) => c.id === p.cat)
  const { avg, count } = ratingFor(p.id)
  const off = discountPercent(p)
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4)

  return (
    <div className="container-x py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink/55">
        <Link to="/" className="hover:text-olive">Home</Link><FiChevronRight />
        <Link to="/shop" className="hover:text-olive">Shop</Link><FiChevronRight />
        {cat && <><Link to={`/category/${cat.id}`} className="hover:text-olive">{cat.name}</Link><FiChevronRight /></>}
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="overflow-hidden bg-cream"><ProductImage key={cur} src={p.images[cur]} alt={p.name} className="aspect-square w-full animate-fade-in" /></div>
          {p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {p.images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} className={`overflow-hidden border-2 transition ${cur === i ? 'border-olive' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <ProductImage src={src} alt="" className="aspect-square w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {cat && <Link to={`/category/${cat.id}`} className="text-sm text-olive hover:underline">{cat.name}</Link>}
          <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-ink/65">
            {count > 0 ? <><Stars value={avg} size={16} /><a href="#reviews" className="hover:text-olive">{avg.toFixed(1)} ({count} reviews)</a></> : <span>No reviews yet</span>}
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl">{formatPrice(p.price)}</span>
            {p.oldPrice && <><span className="text-ink/45 line-through">{formatPrice(p.oldPrice)}</span><span className="text-sm text-olive">{off}% off</span></>}
          </div>
          <p className="mt-1 text-xs text-ink/50">Inclusive of taxes. Free delivery above ₹999.</p>
          <p className="mt-6 leading-relaxed text-ink/80">{p.desc}</p>

          <dl className="mt-6 grid grid-cols-[110px_1fr] gap-y-2 border-y border-sand py-5 text-sm">
            <dt className="text-ink/55">Material</dt><dd>{p.material}</dd>
            <dt className="text-ink/55">Category</dt><dd>{cat?.name}</dd>
            <dt className="text-ink/55">Sold by</dt><dd>{p.seller.name}</dd>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center border border-sand bg-white">
              <button aria-label="Decrease quantity" className="p-3 hover:text-olive disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}><FiMinus size={15} /></button>
              <span className="w-10 text-center" aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" className="p-3 hover:text-olive" onClick={() => setQty((q) => Math.min(q + 1, 20))}><FiPlus size={15} /></button>
            </div>
            <AddToCartButton id={p.id} qty={qty} className="btn-primary flex-1 px-8 py-3.5 sm:flex-none" />
            <WishlistButton id={p.id} withLabel className="btn-outline" />
          </div>

          <div className="mt-8 flex gap-3 bg-cream p-4 text-sm">
            <FiMapPin className="mt-0.5 shrink-0 text-olive" />
            <div><p className="font-medium">{p.seller.name}</p><p className="text-ink/65">Based in {p.seller.city}. Independent seller on EcoMart.</p></div>
          </div>
        </div>
      </div>

      <Reveal className="mt-16"><EcoInfo eco={p.eco} /></Reveal>
      <div id="reviews" className="mt-16 scroll-mt-28"><Reveal><ReviewsSection productId={p.id} /></Reveal></div>
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal><h2 className="mb-8 text-2xl sm:text-3xl">You may also like</h2></Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
