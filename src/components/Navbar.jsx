import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { useStore, FREE_DELIVERY_ABOVE } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import Logo from './Logo'
import SearchBar from './SearchBar'

const links = [
  ['/shop', 'Shop'],
  ['/about', 'About'],
  ['/sell', 'Sell with us'],
  ['/contact', 'Contact'],
]

export default function Navbar() {
  const { cartCount, wishlist, currentUser, logout } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const userRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false); setSearchOpen(false); setUserOpen(false) }, [pathname])
  useEffect(() => {
    const close = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const search = (v) => { navigate(`/shop?q=${encodeURIComponent(v.trim())}`); setQ(''); setSearchOpen(false) }
  const iconBtn = 'relative flex h-10 w-10 items-center justify-center transition hover:text-olive'

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-olive px-4 py-2 text-center text-xs text-white">
        Free delivery on orders above {formatPrice(FREE_DELIVERY_ABOVE)} across India
      </div>
      <div className={`border-b transition duration-300 ${scrolled ? 'border-sand bg-ivory/95 shadow-soft backdrop-blur' : 'border-transparent bg-ivory'}`}>
        <div className={`container-x flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-[72px]'}`}>
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main">
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => `relative py-1 transition hover:text-olive after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-olive after:transition-transform ${isActive ? 'text-olive after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>{searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}</button>
            <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wishlist.length} items`}>
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-olive px-1 text-[10px] text-white">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className={iconBtn} aria-label={`Cart, ${cartCount} items`}>
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span key={cartCount} className="absolute right-0.5 top-0.5 flex h-4 min-w-4 animate-pop items-center justify-center bg-olive px-1 text-[10px] text-white">{cartCount}</span>}
            </Link>
            <div className="relative hidden md:block" ref={userRef}>
              <button className={iconBtn} aria-label="Account" aria-expanded={userOpen} onClick={() => currentUser ? setUserOpen((o) => !o) : navigate('/login')}><FiUser size={20} /></button>
              {userOpen && currentUser && (
                <div className="absolute right-0 top-11 w-56 animate-fade-in border border-sand bg-white p-2 text-sm shadow-lift">
                  <p className="px-3 py-2 text-xs text-ink/55">Signed in as<br /><span className="text-sm text-ink">{currentUser.name}</span></p>
                  {currentUser.role === 'admin' && <Link to="/admin" className="block px-3 py-2 hover:bg-cream">Admin dashboard</Link>}
                  <button onClick={logout} className="block w-full px-3 py-2 text-left hover:bg-cream">Sign out</button>
                </div>
              )}
            </div>
            <button className={`${iconBtn} md:hidden`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? <FiX size={22} /> : <FiMenu size={22} />}</button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-sand animate-fade-in"><div className="container-x py-3"><SearchBar value={q} onChange={setQ} onSubmit={search} autoFocus placeholder="Search for straws, notebooks, planters…" /></div></div>
        )}
        {open && (
          <nav className="animate-fade-in border-t border-sand bg-ivory md:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col py-3 text-base">
              {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `py-3 ${isActive ? 'text-olive' : ''}`}>{label}</NavLink>)}
              {currentUser ? (
                <>
                  {currentUser.role === 'admin' && <Link to="/admin" className="py-3">Admin dashboard</Link>}
                  <button onClick={logout} className="py-3 text-left">Sign out ({currentUser.name.split(' ')[0]})</button>
                </>
              ) : (
                <><Link to="/login" className="py-3">Sign in</Link><Link to="/register" className="py-3">Create account</Link></>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
