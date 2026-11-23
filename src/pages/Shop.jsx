import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FiSliders } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import PageHeader from '../components/PageHeader'
import FilterSidebar from '../components/FilterSidebar'
import SearchBar from '../components/SearchBar'
import ProductGrid from '../components/ProductGrid'

const PAGE = 12

export default function Shop() {
  const { products, categories } = useStore()
  const { slug } = useParams()
  const [sp] = useSearchParams()
  const navigate = useNavigate()

  const category = slug || sp.get('category') || ''
  const q = sp.get('q') || ''
  const sort = sp.get('sort') || 'popular'
  const min = sp.get('min') || ''
  const max = sp.get('max') || ''
  const [search, setSearch] = useState(q)
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(PAGE)

  useEffect(() => setSearch(q), [q])
  useEffect(() => setVisible(PAGE), [category, q, sort, min, max])

  const update = (patch) => {
    const next = { category, q, sort, min, max, ...patch }
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v !== '' && v !== undefined && !(k === 'sort' && v === 'popular')) params.set(k, v) })
    navigate(`/shop${params.toString() ? `?${params}` : ''}`, { replace: true })
  }

  // debounce typing into the URL
  useEffect(() => {
    if (search === q) return
    const t = setTimeout(() => update({ q: search }), 250)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line

  const counts = useMemo(() => {
    const m = { all: products.length }
    products.forEach((p) => { m[p.cat] = (m[p.cat] || 0) + 1 })
    return m
  }, [products])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = products.filter((p) => {
      if (category && p.cat !== category) return false
      if (min !== '' && p.price < Number(min)) return false
      if (max !== '' && p.price > Number(max)) return false
      if (term) {
        const hay = `${p.name} ${p.material} ${p.seller.name} ${categories.find((c) => c.id === p.cat)?.name || ''}`.toLowerCase()
        return term.split(/\s+/).every((w) => hay.includes(w))
      }
      return true
    })
    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      popular: (a, b) => (b.sold || 0) - (a.sold || 0),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    }
    list = [...list].sort(sorters[sort] || sorters.popular)
    return list
  }, [products, categories, category, q, min, max, sort])

  const activeCat = categories.find((c) => c.id === category)
  const filters = (
    <FilterSidebar
      categories={categories} counts={counts} category={category} min={min} max={max}
      onCategory={(c) => update({ category: c })}
      onPrice={(a, b) => update({ min: a, max: b })}
      onClear={() => { setSearch(''); navigate('/shop') }}
    />
  )

  return (
    <>
      <PageHeader title={activeCat ? activeCat.name : 'Shop'}>{activeCat ? activeCat.blurb : `${products.length} products from independent sellers.`}</PageHeader>
      <div className="container-x py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">{filters}</aside>
          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <SearchBar value={search} onChange={setSearch} onSubmit={(v) => update({ q: v })} className="flex-1" />
              <div className="flex gap-3">
                <button className="btn-outline flex-1 lg:hidden" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}><FiSliders /> Filters</button>
                <select aria-label="Sort products" value={sort} onChange={(e) => update({ sort: e.target.value })} className="input flex-1 sm:w-52 sm:flex-none">
                  <option value="popular">Most popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
            </div>
            {showFilters && <div className="mb-8 animate-fade-in border border-sand bg-white p-5 lg:hidden">{filters}</div>}
            <p className="mb-5 text-sm text-ink/60" aria-live="polite">{results.length} product{results.length !== 1 ? 's' : ''}{q ? ` for “${q}”` : ''}</p>
            <ProductGrid
              products={results.slice(0, visible)}
              cols="grid-cols-2 xl:grid-cols-3"
              empty="Nothing matches those filters. Try a different search or clear the filters."
            />
            {visible < results.length && (
              <div className="mt-12 text-center"><button className="btn-outline" onClick={() => setVisible((v) => v + PAGE)}>Show more ({results.length - visible} left)</button></div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
