import { useStore } from '../../context/StoreContext'
import { formatDate } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'

const tone = { Pending: 'bg-cream text-ink', Approved: 'bg-olive text-white', Rejected: 'bg-red-100 text-red-800' }

export default function AdminSellers() {
  const { sellerApps, setSellerStatus, categories } = useStore()
  return (
    <>
      <AdminHeading title="Seller applications">{sellerApps.filter((a) => a.status === 'Pending').length} waiting for review.</AdminHeading>
      <DataTable
        rows={sellerApps}
        empty="No applications yet."
        columns={[
          { key: 'b', label: 'Business', render: (a) => <div><p className="font-medium">{a.business}</p><p className="text-xs text-ink/55">{a.sellerName} · {a.email}</p></div> },
          { key: 'c', label: 'Category', render: (a) => categories.find((c) => c.id === a.category)?.name || a.category },
          { key: 'd', label: 'About', render: (a) => <p className="max-w-xs text-xs text-ink/70">{a.description}</p> },
          { key: 'dt', label: 'Applied', render: (a) => formatDate(a.date) },
          { key: 's', label: 'Status', render: (a) => <span className={`px-2 py-1 text-xs ${tone[a.status]}`}>{a.status}</span> },
          { key: 'a', label: 'Actions', render: (a) => a.status === 'Pending' ? (
            <div className="flex gap-2"><button className="btn-primary btn-sm" onClick={() => setSellerStatus(a.id, 'Approved')}>Approve</button><button className="btn-outline btn-sm" onClick={() => setSellerStatus(a.id, 'Rejected')}>Reject</button></div>
          ) : <button className="text-xs text-ink/55 underline" onClick={() => setSellerStatus(a.id, 'Pending')}>Reopen</button> },
        ]}
      />
    </>
  )
}
