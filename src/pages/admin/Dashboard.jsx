import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice, formatDate } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'

export default function Dashboard() {
  const { products, orders, users, sellerApps } = useStore()
  const live = orders.filter((o) => o.status !== 'Cancelled')
  const revenue = live.reduce((s, o) => s + o.total, 0)
  const customers = users.filter((u) => u.role === 'customer').length
  const sellers = new Set([...products.map((p) => p.seller.name), ...sellerApps.filter((a) => a.status === 'Approved').map((a) => a.business)]).size

  // revenue for the last 6 months
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('en-IN', { month: 'short' }), total: 0 }
  })
  live.forEach((o) => {
    const d = new Date(o.date)
    const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`)
    if (m) m.total += o.total
  })
  const peak = Math.max(...months.map((m) => m.total), 1)

  const stats = [
    ['Total products', products.length, '/admin/products'],
    ['Total orders', orders.length, '/admin/orders'],
    ['Total customers', customers, '/admin/customers'],
    ['Total sellers', sellers, '/admin/sellers'],
  ]

  return (
    <>
      <AdminHeading title="Overview">A snapshot of your store.</AdminHeading>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, to]) => (
          <Link key={label} to={to} className="border border-sand bg-white p-5 transition hover:border-olive hover:shadow-soft">
            <p className="text-sm text-ink/60">{label}</p><p className="mt-2 font-display text-4xl">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="border border-sand bg-white p-6">
          <div className="flex items-baseline justify-between"><h2 className="text-xl">Revenue overview</h2><p className="text-sm text-ink/60">Last 6 months</p></div>
          <p className="mt-3 font-display text-4xl">{formatPrice(revenue)}</p>
          <p className="text-xs text-ink/55">Total from {live.length} orders (cancelled excluded)</p>
          <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label="Monthly revenue bar chart">
            {months.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] text-ink/55">{m.total ? formatPrice(m.total) : ''}</span>
                <div className="w-full bg-olive/80 transition-all duration-700" style={{ height: `${Math.max((m.total / peak) * 140, m.total ? 4 : 2)}px`, opacity: m.total ? 1 : 0.25 }} />
                <span className="text-xs">{m.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="border border-sand bg-white p-6">
          <h2 className="text-xl">Orders by status</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
              <li key={s} className="flex justify-between border-b border-sand pb-2"><span>{s}</span><span>{orders.filter((o) => o.status === s).length}</span></li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink/60">{sellerApps.filter((a) => a.status === 'Pending').length} seller applications waiting for review.</p>
        </section>
      </div>
      <section className="mt-6">
        <h2 className="mb-3 text-xl">Recent orders</h2>
        <DataTable
          rows={orders.slice(0, 5)}
          columns={[
            { key: 'id', label: 'Order' },
            { key: 'customer', label: 'Customer', render: (o) => o.customer.name },
            { key: 'date', label: 'Date', render: (o) => formatDate(o.date) },
            { key: 'total', label: 'Total', render: (o) => formatPrice(o.total) },
            { key: 'status', label: 'Status' },
          ]}
        />
      </section>
    </>
  )
}
