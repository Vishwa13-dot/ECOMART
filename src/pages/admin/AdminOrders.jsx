import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { formatPrice, formatDate } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const { orders, setOrderStatus } = useStore()
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)
  const rows = orders.filter((o) => filter === 'All' || o.status === filter)
  return (
    <>
      <AdminHeading title="Orders">{orders.length} orders in total.</AdminHeading>
      <div className="mb-4 flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={`border px-3 py-1.5 text-xs transition ${filter === s ? 'border-olive bg-olive text-white' : 'border-sand bg-white hover:border-olive'}`}>{s}</button>)}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'id', label: 'Order', render: (o) => <button className="text-olive underline-offset-2 hover:underline" onClick={() => setOpen(open === o.id ? null : o.id)}>{o.id}</button> },
          { key: 'c', label: 'Customer', render: (o) => o.customer.name },
          { key: 'd', label: 'Date', render: (o) => formatDate(o.date) },
          { key: 'i', label: 'Items', render: (o) => o.items.reduce((s, i) => s + i.qty, 0) },
          { key: 't', label: 'Total', render: (o) => formatPrice(o.total) },
          { key: 'p', label: 'Payment', render: (o) => o.payment },
          { key: 's', label: 'Status', render: (o) => (
            <select aria-label={`Status for ${o.id}`} value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)} className="border border-sand bg-white px-2 py-1.5 text-sm">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ) },
        ]}
      />
      {open && (() => { const o = orders.find((x) => x.id === open); return o && (
        <div className="mt-4 animate-fade-in border border-sand bg-white p-5 text-sm">
          <h2 className="text-lg">Order {o.id}</h2>
          <ul className="mt-3 divide-y divide-sand">{o.items.map((i) => <li key={i.id} className="flex justify-between py-2"><span>{i.name} × {i.qty}</span><span>{formatPrice(i.price * i.qty)}</span></li>)}</ul>
          <p className="mt-3 text-ink/65">{o.customer.name}, {o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode} · {o.customer.phone}</p>
        </div>) })()}
    </>
  )
}
