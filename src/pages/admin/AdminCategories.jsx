import { useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'
import Field from '../../components/Field'
import ImagePicker from '../../components/ImagePicker'
import ProductImage from '../../components/ProductImage'
import { defaultCategoryRef } from '../../utils/images'

const slugify = (s) => s.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function AdminCategories() {
  const { categories, products, saveCategory, deleteCategory, addMedia, resolveImage } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', blurb: '', kw: '' })
  const [error, setError] = useState('')
  const [pic, setPic] = useState({ ref: '', pending: null }) // ref: saved custom image ('' = default), pending: unsaved choice

  const startEdit = (c) => { setEditing(c); setForm({ name: c.name, blurb: c.blurb, kw: c.kw }); setPic({ ref: c.image || '', pending: null }); setError('') }
  const reset = () => { setEditing(null); setForm({ name: '', blurb: '', kw: '' }); setPic({ ref: '', pending: null }); setError('') }
  const fallback = resolveImage(defaultCategoryRef({ id: editing?.id, kw: form.kw }))
  const preview = pic.pending ? (pic.pending.reset ? fallback : pic.pending.dataUrl || pic.pending.url) : pic.ref ? resolveImage(pic.ref) : fallback
  const isCustom = pic.pending ? !pic.pending.reset : !!pic.ref
  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 3) { setError('Enter a category name of at least 3 characters.'); return }
    const id = editing?.id || slugify(form.name)
    if (!editing && categories.some((c) => c.id === id)) { setError('A category with this name already exists.'); return }
    const p = pic.pending
    const image = !p ? pic.ref : p.reset ? '' : p.dataUrl ? addMedia(p.dataUrl) : p.url
    saveCategory({ id, name: form.name.trim(), blurb: form.blurb.trim() || 'Products in this category.', kw: form.kw.trim() || 'eco,product', image })
    reset()
  }

  return (
    <>
      <AdminHeading title="Categories">{categories.length} categories.</AdminHeading>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <DataTable
          rows={categories}
          columns={[
            { key: 'img', label: '', render: (c) => <ProductImage src={c.imageUrl} alt="" className="h-12 w-12" /> },
            { key: 'name', label: 'Name' },
            { key: 'n', label: 'Products', render: (c) => products.filter((p) => p.cat === c.id).length },
            { key: 'b', label: 'Description', render: (c) => <span className="text-xs text-ink/70">{c.blurb}</span> },
            { key: 'a', label: 'Actions', render: (c) => (
              <div className="flex gap-3">
                <button aria-label={`Edit ${c.name}`} className="text-ink/60 hover:text-olive" onClick={() => startEdit(c)}><FiEdit2 /></button>
                <button aria-label={`Delete ${c.name}`} className="text-ink/60 hover:text-red-600" onClick={() => window.confirm(`Delete “${c.name}”?`) && deleteCategory(c.id)}><FiTrash2 /></button>
              </div>
            ) },
          ]}
        />
        <form onSubmit={submit} noValidate className="h-fit space-y-4 border border-sand bg-white p-5">
          <h2 className="text-xl">{editing ? 'Edit category' : 'Add category'}</h2>
          <Field label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={error} />
          <Field label="Description" name="blurb" value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
          <div>
            <span className="label">Category image</span>
            <ImagePicker preview={preview} ratio="aspect-[4/5]" isCustom={isCustom} note="Shown on the home page and category cards. Portrait photos work best."
              onPick={(x) => setPic({ ...pic, pending: x })} onReset={() => setPic({ ...pic, pending: { reset: true } })} />
          </div>
          <Field label="Placeholder artwork keywords (only used when no image is set)" name="kw" value={form.kw} onChange={(e) => setForm({ ...form, kw: e.target.value })} />
          <div className="flex gap-2"><button className="btn-primary">{editing ? 'Save changes' : 'Add category'}</button>{editing && <button type="button" className="btn-outline" onClick={reset}>Cancel</button>}</div>
        </form>
      </div>
    </>
  )
}
