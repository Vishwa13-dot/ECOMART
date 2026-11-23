import ProductCard from './ProductCard'
import Reveal from './Reveal'

export default function ProductGrid({ products, cols = 'grid-cols-2 lg:grid-cols-4', empty = 'No products found.' }) {
  if (!products.length) return <p className="py-16 text-center text-ink/60">{empty}</p>
  return (
    <div className={`grid gap-x-4 gap-y-9 sm:gap-x-6 ${cols}`}>
      {products.map((p, i) => (
        <Reveal key={p.id} delay={(i % 4) * 70}><ProductCard product={p} /></Reveal>
      ))}
    </div>
  )
}
