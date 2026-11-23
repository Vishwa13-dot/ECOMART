import { Link, useParams } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { formatPrice, formatDate } from '../utils/format'
import NotFound from './NotFound'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders } = useStore()
  const o = orders.find((x) => x.id === id)
  if (!o) return <NotFound message="We couldn’t find that order." />
  return (
    <div className="container-x max-w-3xl py-14 sm:py-20">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 animate-pop items-center justify-center bg-olive text-white"><FiCheck size={26} /></span>
        <h1 className="mt-6 text-4xl">Thank you, {o.customer.name.split(' ')[0]}</h1>
        <p className="mt-3 text-ink/70">Your order <strong className="font-medium text-ink">{o.id}</strong> has been placed on {formatDate(o.date)}. We&rsquo;ve sent a confirmation to {o.customer.email}.</p>
      </div>
      <div className="mt-10 border border-sand bg-white p-6">
        <ul className="divide-y divide-sand">
          {o.items.map((i) => <li key={i.id} className="flex justify-between gap-4 py-3 text-sm"><span>{i.name} × {i.qty}</span><span>{formatPrice(i.price * i.qty)}</span></li>)}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-ink/65">Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/65">Delivery</dt><dd>{o.delivery ? formatPrice(o.delivery) : 'Free'}</dd></div>
          <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd>{formatPrice(o.total)}</dd></div>
        </dl>
        <div className="mt-6 grid gap-6 border-t border-sand pt-6 text-sm sm:grid-cols-2">
          <div><p className="font-medium">Delivering to</p><p className="mt-1 text-ink/70">{o.customer.name}<br />{o.customer.address}<br />{o.customer.city}, {o.customer.state} {o.customer.pincode}</p></div>
          <div><p className="font-medium">Payment</p><p className="mt-1 text-ink/70">{o.payment} (demo)<br />Estimated delivery in 3–7 working days.</p></div>
        </div>
      </div>
      <div className="mt-8 text-center"><Link to="/shop" className="btn-primary">Continue shopping</Link></div>
    </div>
  )
}
