import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { formatDate } from '../utils/format'
import Stars from './Stars'

export default function ReviewsSection({ productId }) {
  const { reviews, ratingFor, addReview, currentUser } = useStore()
  const list = reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.date) - new Date(a.date))
  const { avg, count } = ratingFor(productId)
  const [form, setForm] = useState({ name: currentUser?.name || '', rating: 5, text: '' })
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your name.'
    if (form.text.trim().length < 10) er.text = 'Write at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) return
    addReview({ productId, name: form.name.trim(), rating: Number(form.rating), title: '', text: form.text.trim() })
    setForm((f) => ({ ...f, text: '', rating: 5 }))
  }

  return (
    <section aria-labelledby="reviews-h">
      <h2 id="reviews-h" className="text-2xl sm:text-3xl">Customer reviews</h2>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          {count > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <span className="font-display text-4xl">{avg.toFixed(1)}</span>
              <div><Stars value={avg} size={16} /><p className="mt-0.5 text-xs text-ink/55">{count} review{count > 1 ? 's' : ''}</p></div>
            </div>
          )}
          {list.length === 0 && <p className="text-ink/60">No reviews yet. Be the first to share how it works for you.</p>}
          <ul className="divide-y divide-sand">
            {list.map((r) => (
              <li key={r.id} className="py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3"><Stars value={r.rating} /><span className="text-sm font-medium">{r.name}</span></div>
                  <span className="text-xs text-ink/50">{formatDate(r.date)}</span>
                </div>
                {r.title && <p className="mt-2 font-medium">{r.title}</p>}
                <p className="mt-1 text-sm leading-relaxed text-ink/75">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={submit} noValidate className="h-fit border border-sand bg-white p-5">
          <h3 className="text-lg">Write a review</h3>
          <div className="mt-4">
            <label className="label" htmlFor="rv-name">Name</label>
            <input id="rv-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div className="mt-4">
            <span className="label">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setForm({ ...form, rating: n })} className="p-0.5 text-olive transition hover:scale-110">
                  <FiStar size={22} className={n <= form.rating ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="rv-text">Your review</label>
            <textarea id="rv-text" rows={4} className="input" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            {errors.text && <p className="mt-1 text-xs text-red-600">{errors.text}</p>}
          </div>
          <button className="btn-primary mt-5 w-full">Post review</button>
        </form>
      </div>
    </section>
  )
}
