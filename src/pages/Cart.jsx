import { Link, useNavigate } from 'react-router-dom'
import { useStore, FREE_DELIVERY_ABOVE } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import PageHeader from '../components/PageHeader'
import CartItem from '../components/CartItem'

export function Summary({ rows }) {
  const { subtotal, delivery, total } = useStore()
  return (
    <div className="h-fit border border-sand bg-white p-6">
      <h2 className="text-xl">Order summary</h2>
      {rows}
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink/65">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-ink/65">Delivery</dt><dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd></div>
        <div className="flex justify-between border-t border-sand pt-3 text-base font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
    </div>
  )
}

export default function Cart() {
  const { cartItems, subtotal, cartCount } = useStore()
  const navigate = useNavigate()
  const remaining = FREE_DELIVERY_ABOVE - subtotal
  return (
    <>
      <PageHeader title="Your cart">{cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}</PageHeader>
      <div className="container-x py-10">
        {cartItems.length === 0 ? (
          <div className="py-16 text-center"><p className="text-ink/65">Your cart is empty.</p><Link to="/shop" className="btn-primary mt-6">Start shopping</Link></div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              {remaining > 0 && <p className="mb-2 bg-cream px-4 py-3 text-sm">Add {formatPrice(remaining)} more for free delivery.</p>}
              {cartItems.map((i) => <CartItem key={i.id} item={i} />)}
              <Link to="/shop" className="mt-6 inline-block text-sm text-olive underline-offset-4 hover:underline">Continue shopping</Link>
            </div>
            <div>
              <Summary />
              <button className="btn-primary mt-4 w-full py-3.5" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
