import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'

export default function CategoryCard({ category, index = 0, count }) {
  return (
    <Link to={`/category/${category.id}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <ProductImage src={category.imageUrl} alt={category.name} className="aspect-[4/5] w-full transition duration-700 ease-out group-hover:scale-[1.07]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg leading-tight sm:text-xl">{category.name}</h3>
          {count !== undefined && <p className="mt-0.5 text-xs text-white/80">{count} products</p>}
        </div>
      </div>
    </Link>
  )
}
