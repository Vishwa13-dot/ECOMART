import { Link } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'

export default function AdminNavbar({ onMenu }) {
  const { currentUser, logout } = useStore()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand bg-ivory/95 px-5 backdrop-blur">
      <button className="lg:hidden" aria-label="Open menu" onClick={onMenu}><FiMenu size={22} /></button>
      <p className="hidden text-sm text-ink/60 lg:block">Admin dashboard</p>
      <div className="flex items-center gap-5 text-sm">
        <Link to="/" className="hover:text-olive">View store</Link>
        <span className="hidden text-ink/60 sm:inline">{currentUser?.name}</span>
        <button onClick={logout} className="hover:text-olive">Sign out</button>
      </div>
    </header>
  )
}
