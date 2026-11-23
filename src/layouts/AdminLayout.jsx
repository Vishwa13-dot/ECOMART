import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import AdminSidebar from '../components/AdminSidebar'
import AdminNavbar from '../components/AdminNavbar'

export default function AdminLayout() {
  const { currentUser } = useStore()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login" replace state={{ from: pathname, adminOnly: true }} />
  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar onMenu={() => setOpen(true)} />
        <main key={pathname} className="animate-page-in p-5 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
