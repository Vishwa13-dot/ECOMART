import { useStore } from '../../context/StoreContext'
import { formatPrice, formatDate } from '../../utils/format'
import AdminHeading from '../../components/AdminHeading'
import DataTable from '../../components/DataTable'

export default function AdminCustomers() {
  const { users, orders } = useStore()
  const rows = users.filter((u) => u.role === 'customer').map((u) => {
    const mine = orders.filter((o) => o.customer.email.toLowerCase() === u.email.toLowerCase() && o.status !== 'Cancelled')
    return { ...u, orders: mine.length, spent: mine.reduce((s, o) => s + o.total, 0) }
  })
  return (
    <>
      <AdminHeading title="Customers">{rows.length} registered customers.</AdminHeading>
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'joined', label: 'Joined', render: (u) => formatDate(u.joined) },
          { key: 'orders', label: 'Orders' },
          { key: 'spent', label: 'Total spent', render: (u) => formatPrice(u.spent) },
        ]}
      />
    </>
  )
}
