import { Link } from 'react-router-dom'
import { FiTruck, FiRefreshCw, FiInfo, FiShield, FiArrowRight } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { testimonials } from '../data/products'
import { discountPercent } from '../utils/format'
import HeroSection from '../components/HeroSection'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import SiteImage from '../components/SiteImage'
import Newsletter from '../components/Newsletter'
import Reveal from '../components/Reveal'

function SectionHead({ title, text, to, cta = 'View all' }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {text && <p className="mt-2 max-w-lg text-ink/65">{text}</p>}
      </div>
      {to && <Link to={to} className="flex items-center gap-1.5 text-sm text-olive underline-offset-4 hover:underline">{cta} <FiArrowRight /></Link>}
    </div>
  )
}

export default function Home() {
  const { products, categories, ratingFor } = useStore()
  const counts = products.reduce((m, p) => ({ ...m, [p.cat]: (m[p.cat] || 0) + 1 }), {})
  const featured = products.filter((p) => p.featured).slice(0, 8)
  const best = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8)
  const fresh = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
  const offers = products.filter((p) => p.oldPrice).sort((a, b) => discountPercent(b) - discountPercent(a)).slice(0, 4)

  const benefits = [
    [FiTruck, 'Free delivery above ₹999', 'Flat ₹79 on smaller orders.'],
    [FiInfo, 'Clear product information', 'Materials, care and disposal on every page.'],
    [FiRefreshCw, '7-day returns', 'For unused items in original packaging.'],
    [FiShield, 'Independent sellers', 'Every seller is reviewed before listing.'],
  ]

  return (
    <>
      <HeroSection />

      <section id="categories" className="section bg-cream/50">
        <div className="container-x">
          <Reveal><SectionHead title="Explore categories" text="Eight shelves, from kitchen swaps to garden kits." to="/shop" cta="Shop everything" /></Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {categories.map((c, i) => <Reveal key={c.id} delay={(i % 4) * 80}><CategoryCard category={c} index={i} count={counts[c.id] || 0} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal><SectionHead title="Featured products" text="Picked by our team this month." to="/shop" /></Reveal>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="section bg-cream/50">
        <div className="container-x">
          <Reveal><SectionHead title="Best sellers" text="What customers keep reordering." to="/shop?sort=popular" /></Reveal>
          <Reveal>
            <div className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
              {best.map((p) => <div key={p.id} className="w-[220px] shrink-0 snap-start sm:w-[260px]"><ProductCard product={p} /></div>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal><SectionHead title="New arrivals" to="/shop?sort=newest" /></Reveal>
          <ProductGrid products={fresh} />
        </div>
      </section>

      <section className="bg-olive text-white">
        <div className="container-x py-14 sm:py-20">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">Special offers</h2>
            <p className="mt-2 text-white/80">Limited-time prices from our sellers.</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {offers.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link to={`/product/${p.id}`} className="group block bg-ivory text-ink">
                  <div className="relative overflow-hidden"><ProductImage src={p.images[0]} alt={p.name} className="aspect-square w-full transition duration-700 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-olive px-2 py-1 text-xs text-white">{discountPercent(p)}% off</span></div>
                  <div className="p-3"><p className="text-sm font-medium leading-snug">{p.name}</p><p className="mt-1 text-sm">₹{p.price.toLocaleString('en-IN')} <span className="text-ink/45 line-through">₹{p.oldPrice.toLocaleString('en-IN')}</span></p></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <SiteImage slot="home-story" className="aspect-[5/4] w-full" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-3xl sm:text-4xl">Sustainability, without the spin</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink/75">
              A bamboo brush isn&rsquo;t automatically better than a plastic one, and recycled isn&rsquo;t always lower-impact. So we don&rsquo;t make big claims. Every product lists its materials, how long it should last, how to care for it, and what to do with it afterwards.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/80">
              <li><strong className="font-medium">Seller statements are labelled.</strong> If a claim comes from the seller, we say so.</li>
              <li><strong className="font-medium">We note the trade-offs.</strong> Each page has a &ldquo;worth knowing&rdquo; note.</li>
              <li><strong className="font-medium">We support small makers.</strong> Most sellers are independent workshops and studios.</li>
            </ul>
            <Link to="/about" className="btn-outline mt-8">How we choose sellers</Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-sand bg-cream/50">
        <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 70} className="flex gap-4">
              <Icon size={24} className="mt-0.5 shrink-0 text-olive" />
              <div><h3 className="text-lg">{t}</h3><p className="mt-1 text-sm text-ink/65">{d}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal><SectionHead title="What customers say" /></Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <figure className="h-full border-t-2 border-olive pt-5">
                  <blockquote className="leading-relaxed text-ink/80">{t.text}</blockquote>
                  <figcaption className="mt-4 text-sm"><span className="font-medium">{t.name}</span>, <span className="text-ink/55">{t.city}</span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
