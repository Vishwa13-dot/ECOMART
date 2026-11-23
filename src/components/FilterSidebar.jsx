import { FiX } from 'react-icons/fi'
import { formatPrice } from '../utils/format'

const RANGES = [[0, 299], [300, 599], [600, 999], [1000, 5000]]

export default function FilterSidebar({ categories, counts, category, min, max, onCategory, onPrice, onClear }) {
  const active = RANGES.findIndex(([a, b]) => Number(min) === a && Number(max) === b)
  return (
    <div className="space-y-8 text-sm">
      <div>
        <h3 className="mb-3 text-lg">Categories</h3>
        <ul className="space-y-1">
          <li>
            <button onClick={() => onCategory('')} className={`flex w-full justify-between py-1.5 text-left transition hover:text-olive ${!category ? 'font-medium text-olive' : ''}`}>
              All products <span className="text-ink/45">{counts.all}</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button onClick={() => onCategory(c.id)} className={`flex w-full justify-between gap-2 py-1.5 text-left transition hover:text-olive ${category === c.id ? 'font-medium text-olive' : ''}`}>
                {c.name} <span className="text-ink/45">{counts[c.id] || 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 text-lg">Price</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {RANGES.map(([a, b], i) => (
            <button key={i} onClick={() => onPrice(a, b)} className={`border px-3 py-1.5 text-xs transition ${active === i ? 'border-olive bg-olive text-white' : 'border-sand bg-white hover:border-olive'}`}>
              {b >= 5000 ? `${formatPrice(a)}+` : `${formatPrice(a)} – ${formatPrice(b)}`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="number" min="0" aria-label="Minimum price" placeholder="Min" value={min} onChange={(e) => onPrice(e.target.value, max)} className="input !py-2" />
          <span className="text-ink/40">to</span>
          <input type="number" min="0" aria-label="Maximum price" placeholder="Max" value={max} onChange={(e) => onPrice(min, e.target.value)} className="input !py-2" />
        </div>
      </div>
      <button onClick={onClear} className="flex items-center gap-1.5 text-ink/60 underline-offset-4 hover:text-olive hover:underline"><FiX size={14} /> Clear all filters</button>
    </div>
  )
}
