import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import { formatDate } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'
import Stars from '../../components/Stars'

export default function AdminReviews() {
  const { reviews, productById, deleteReview } = useStore()
  const [rating, setRating] = useState('All')
  const rows = reviews
    .filter((r) => rating === 'All' || r.rating === Number(rating))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 60)
  return (
    <>
      <AdminHeading title="Reviews">{reviews.length} reviews. Showing the latest 60.</AdminHeading>
      <div className="mb-4 flex flex-wrap gap-2">
        {['All', 5, 4, 3, 2, 1].map((r) => <button key={r} onClick={() => setRating(String(r))} className={`border px-3 py-1.5 text-xs transition ${rating === String(r) ? 'border-olive bg-olive text-white' : 'border-sand bg-white hover:border-olive'}`}>{r === 'All' ? 'All' : `${r} star`}</button>)}
      </div>
      <DataTable
        rows={rows}
        empty="No reviews match this filter."
        columns={[
          { key: 'p', label: 'Product', render: (r) => <span className="line-clamp-2 max-w-[200px]">{productById(r.productId)?.name || 'Deleted product'}</span> },
          { key: 'n', label: 'Customer', render: (r) => r.name },
          { key: 'r', label: 'Rating', render: (r) => <Stars value={r.rating} /> },
          { key: 't', label: 'Review', render: (r) => <p className="max-w-sm text-xs text-ink/75">{r.title ? <strong className="font-medium">{r.title}. </strong> : null}{r.text}</p> },
          { key: 'd', label: 'Date', render: (r) => formatDate(r.date) },
          { key: 'a', label: '', render: (r) => <button aria-label="Delete review" className="text-ink/60 hover:text-red-600" onClick={() => deleteReview(r.id)}><FiTrash2 /></button> },
        ]}
      />
    </>
  )
}
