import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import Logo from './Logo'
import Reveal from './Reveal'

export default function Footer() {
  const { categories } = useStore()
  return (
    <footer className="border-t border-sand bg-cream/60">
      <Reveal className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/70">A marketplace for sustainable products from independent Indian sellers, with clear information on every listing.</p>
          <div className="mt-5 flex gap-4 text-ink/60">
            <a href="#" aria-label="Instagram" className="hover:text-olive"><FiInstagram /></a>
            <a href="#" aria-label="Facebook" className="hover:text-olive"><FiFacebook /></a>
            <a href="#" aria-label="Twitter" className="hover:text-olive"><FiTwitter /></a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg">Shop</h3>
          <ul className="space-y-2 text-sm text-ink/70">
            {categories.slice(0, 8).map((c) => <li key={c.id}><Link to={`/category/${c.id}`} className="hover:text-olive">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg">EcoMart</h3>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link to="/about" className="hover:text-olive">Our story</Link></li>
            <li><Link to="/sell" className="hover:text-olive">Sell with us</Link></li>
            <li><Link to="/contact" className="hover:text-olive">Contact</Link></li>
            <li><Link to="/wishlist" className="hover:text-olive">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg">Help</h3>
          <ul className="space-y-2 text-sm text-ink/70">
            <li>Delivery in 3–7 working days</li>
            <li>7-day returns on unused items</li>
            <li>hello@ecomart.in</li>
            <li>+91 79 4000 1234</li>
          </ul>
        </div>
      </Reveal>
      <div className="border-t border-sand py-5 text-center text-xs text-ink/55">© {new Date().getFullYear()} EcoMart. This is a demo store; no real orders are placed.</div>
    </footer>
  )
}
