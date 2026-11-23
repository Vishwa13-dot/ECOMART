import { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import { formatPrice, uid } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'
import ProductImage from '../../components/ProductImage'
import Field from '../../components/Field'
import ProductGalleryEditor from '../../components/ProductGalleryEditor'

const blank = { name: '', cat: '', price: '', oldPrice: '', material: '', seller: '', city: '', desc: '', reusability: '', durability: '', care: '', disposal: '' }

function ProductForm({ product, categories, onClose, onSave }) {
  const { addMedia, resolveImage, defaultImagesFor } = useStore()
  const toItems = (refs) => refs.map((ref, i) => ({ key: `e${i}-${Math.random().toString(36).slice(2, 6)}`, ref, src: resolveImage(ref) }))
  const [gallery, setGallery] = useState(() => toItems(product?.imageRefs || []))
  const [usingDefaults, setUsingDefaults] = useState(() => !!product && !product.hasCustomImages)
  const changeGallery = (items) => { setGallery(items); setUsingDefaults(false); setErrors((e) => ({ ...e, images: undefined })) }
  const defaults = product ? defaultImagesFor(product) : []
  const [v, setV] = useState(product ? {
    name: product.name, cat: product.cat, price: product.price, oldPrice: product.oldPrice || '', material: product.material,
    seller: product.seller.name, city: product.seller.city, desc: product.desc,
    reusability: product.eco.reusability, durability: product.eco.durability, care: product.eco.care, disposal: product.eco.disposal,
  } : blank)
  const [errors, setErrors] = useState({})
  const set = (e) => { setV({ ...v, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: undefined }) }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (v.name.trim().length < 3) er.name = 'Enter a product name.'
    if (!v.cat) er.cat = 'Choose a category.'
    if (!(Number(v.price) > 0)) er.price = 'Enter a price above 0.'
    if (v.oldPrice !== '' && Number(v.oldPrice) <= Number(v.price)) er.oldPrice = 'Original price must be higher than the price.'
    if (v.material.trim().length < 3) er.material = 'Enter the material.'
    if (v.seller.trim().length < 2) er.seller = 'Enter the seller name.'
    if (!gallery.length) er.images = 'Add at least one product image.'
    setErrors(er)
    if (Object.keys(er).length) return
    const base = product || {}
    const eco = base.eco || {}
    const id = base.id || uid('p')
    onSave({
      id, name: v.name.trim(), cat: v.cat, price: Number(v.price), oldPrice: v.oldPrice === '' ? null : Number(v.oldPrice),
      material: v.material.trim(), desc: v.desc.trim() || `${v.name.trim()} in ${v.material.trim().toLowerCase()}.`,
      seller: { name: v.seller.trim(), city: v.city.trim() || 'India' },
      // uploaded images are stored once, then every page shows them via a short reference
      images: usingDefaults ? defaults : gallery.map((g) => (g.pending?.dataUrl ? addMedia(g.pending.dataUrl) : g.pending?.url || g.ref)),
      customImages: !usingDefaults,
      sold: base.sold || 0, createdAt: base.createdAt || new Date().toISOString(), featured: base.featured || false,
      eco: {
        material: v.material.trim(),
        reusability: v.reusability.trim() || eco.reusability || 'Information not yet provided by the seller.',
        durability: v.durability.trim() || eco.durability || 'Information not yet provided by the seller.',
        packaging: eco.packaging || 'Paper-based packaging.',
        care: v.care.trim() || eco.care || 'Follow the care label supplied with the product.',
        disposal: v.disposal.trim() || eco.disposal || 'Check local recycling guidance for the main material.',
        sellerNote: eco.sellerNote || `${v.seller.trim()} provided the details on this page. EcoMart has not independently verified them.`,
        caveat: eco.caveat || 'Environmental impact depends on how long and how often you use the product.',
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={product ? 'Edit product' : 'Add product'}>
      <form onSubmit={submit} noValidate className="w-full max-w-3xl animate-fade-up bg-ivory p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between"><h2 className="text-2xl">{product ? 'Edit product' : 'Add product'}</h2><button type="button" onClick={onClose} aria-label="Close"><FiX size={22} /></button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" name="name" value={v.name} onChange={set} error={errors.name} className="sm:col-span-2" />
          <Field label="Category" name="cat" as="select" value={v.cat} onChange={set} error={errors.cat}>
            <option value="">Select</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Field>
          <Field label="Material" name="material" value={v.material} onChange={set} error={errors.material} />
          <Field label="Price (₹)" name="price" type="number" min="1" value={v.price} onChange={set} error={errors.price} />
          <Field label="Original price (₹, optional)" name="oldPrice" type="number" value={v.oldPrice} onChange={set} error={errors.oldPrice} />
          <Field label="Seller name" name="seller" value={v.seller} onChange={set} error={errors.seller} />
          <Field label="Seller city" name="city" value={v.city} onChange={set} />
          <ProductGalleryEditor
            items={gallery.map((g) => (g.pending ? g : { ...g, src: resolveImage(g.ref) }))}
            onChange={changeGallery}
            error={errors.images}
            canRestore={defaults.length > 0 && !usingDefaults}
            onRestoreDefaults={() => { setGallery(toItems(defaults)); setUsingDefaults(true) }}
            folderHint={product ? `Prefer files? Put them in src/assets/images/products/${product.id}/ (1.jpg, 2.jpg, …) and use “Restore default images”.` : undefined}
          />
          <Field label="Description" name="desc" as="textarea" rows={3} value={v.desc} onChange={set} className="sm:col-span-2" />
          <Field label="Reusability" name="reusability" value={v.reusability} onChange={set} />
          <Field label="Durability" name="durability" value={v.durability} onChange={set} />
          <Field label="Care instructions" name="care" value={v.care} onChange={set} />
          <Field label="Disposal" name="disposal" value={v.disposal} onChange={set} />
        </div>
        <div className="mt-6 flex justify-end gap-3"><button type="button" className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary">Save product</button></div>
      </form>
    </div>
  )
}

export default function AdminProducts() {
  const { products, categories, saveProduct, deleteProduct } = useStore()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const rows = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.seller.name.toLowerCase().includes(q.toLowerCase()))
  const catName = (id) => categories.find((c) => c.id === id)?.name || '—'

  return (
    <>
      <AdminHeading title="Products" action={<button className="btn-primary" onClick={() => setEditing('new')}><FiPlus /> Add product</button>}>{products.length} products in the catalogue.</AdminHeading>
      <input className="input mb-4 max-w-sm" placeholder="Search by name or seller" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
      <DataTable
        rows={rows.slice(0, 50)}
        empty="No products match your search."
        columns={[
          { key: 'img', label: '', render: (p) => <ProductImage src={p.images[0]} alt="" className="h-12 w-12" /> },
          { key: 'n', label: 'Photos', render: (p) => <span className={p.images.length ? '' : 'text-red-600'}>{p.images.length}</span> },
          { key: 'name', label: 'Product', render: (p) => <span className="line-clamp-2 max-w-xs">{p.name}</span> },
          { key: 'cat', label: 'Category', render: (p) => catName(p.cat) },
          { key: 'seller', label: 'Seller', render: (p) => p.seller.name },
          { key: 'price', label: 'Price', render: (p) => formatPrice(p.price) },
          { key: 'act', label: 'Actions', render: (p) => (
            <div className="flex gap-3">
              <button aria-label={`Edit ${p.name}`} className="text-ink/60 hover:text-olive" onClick={() => setEditing(p)}><FiEdit2 /></button>
              <button aria-label={`Delete ${p.name}`} className="text-ink/60 hover:text-red-600" onClick={() => window.confirm(`Delete “${p.name}”?`) && deleteProduct(p.id)}><FiTrash2 /></button>
            </div>
          ) },
        ]}
      />
      {rows.length > 50 && <p className="mt-3 text-xs text-ink/55">Showing the first 50 of {rows.length}. Use search to narrow down.</p>}
      {editing && <ProductForm product={editing === 'new' ? null : editing} categories={categories} onClose={() => setEditing(null)} onSave={saveProduct} />}
    </>
  )
}
