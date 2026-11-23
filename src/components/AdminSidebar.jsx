import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiBox, FiShoppingCart, FiUsers, FiBriefcase, FiGrid, FiMessageSquare, FiImage, FiX } from 'react-icons/fi'
import Logo from './Logo'

const items = [
  ['/admin', 'Overview', FiBarChart2, true],
  ['/admin/products', 'Products', FiBox],
  ['/admin/orders', 'Orders', FiShoppingCart],
  ['/admin/customers', 'Customers', FiUsers],
  ['/admin/sellers', 'Seller applications', FiBriefcase],
  ['/admin/categories', 'Categories', FiGrid],
  ['/admin/images', 'Site images', FiImage],
  ['/admin/reviews', 'Reviews', FiMessageSquare],
]

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sand bg-cream/60 bg-ivory transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-sand px-5">
          <Logo to="/admin" />
          <button className="lg:hidden" aria-label="Close menu" onClick={onClose}><FiX /></button>
        </div>
        <nav className="space-y-0.5 p-3 text-sm" aria-label="Admin">
          {items.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 transition ${isActive ? 'bg-olive text-white' : 'hover:bg-cream'}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
