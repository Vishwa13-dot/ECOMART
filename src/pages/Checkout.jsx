import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import { isEmail, isPhone, isPincode } from '../utils/validators'
import useForm from '../hooks/useForm'
import Field from '../components/Field'
import PageHeader from '../components/PageHeader'
import ProductImage from '../components/ProductImage'
import { Summary } from './Cart'

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const PAYMENTS = [
  ['UPI', 'UPI', 'Pay with any UPI app (demo, no real payment).'],
  ['Card', 'Credit or debit card', 'Card details are not collected in this demo.'],
  ['Cash on delivery', 'Cash on delivery', 'Pay when your order arrives.'],
]

export default function Checkout() {
  const { cartItems, placeOrder, currentUser, notify } = useStore()
  const navigate = useNavigate()
  const { values, errors, setErrors, handleChange } = useForm({
    name: currentUser?.name || '', email: currentUser?.email || '', phone: '', address: '', city: '', state: '', pincode: '',
  })
  const [payment, setPayment] = useState('UPI')
  const [busy, setBusy] = useState(false)

  if (cartItems.length === 0 && !busy) return <Navigate to="/cart" replace />

  const validate = () => {
    const e = {}
    if (values.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!isEmail(values.email)) e.email = 'Enter a valid email address.'
    if (!isPhone(values.phone)) e.phone = 'Enter a 10-digit Indian mobile number.'
    if (values.address.trim().length < 8) e.address = 'Enter your full address.'
    if (values.city.trim().length < 2) e.city = 'Enter your city.'
    if (!values.state) e.state = 'Select your state.'
    if (!isPincode(values.pincode)) e.pincode = 'Enter a 6-digit pincode.'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) { notify('Please fix the highlighted fields', 'error'); return }
    setBusy(true)
    setTimeout(() => {
      const order = placeOrder(values, payment)
      navigate(`/order-confirmation/${order.id}`, { replace: true })
    }, 900)
  }

  return (
    <>
      <PageHeader title="Checkout" />
      <form onSubmit={submit} noValidate className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-5 text-2xl">Delivery details</h2>
            {!currentUser && <p className="mb-5 text-sm text-ink/65">Have an account? <Link to="/login" state={{ from: '/checkout' }} className="text-olive underline">Sign in</Link> to fill this in faster.</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" className="sm:col-span-2" />
              <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
              <Field label="Phone number" name="phone" type="tel" value={values.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" placeholder="98765 43210" />
              <Field label="Address" name="address" value={values.address} onChange={handleChange} error={errors.address} autoComplete="street-address" className="sm:col-span-2" />
              <Field label="City" name="city" value={values.city} onChange={handleChange} error={errors.city} autoComplete="address-level2" />
              <Field label="State" name="state" as="select" value={values.state} onChange={handleChange} error={errors.state}>
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </Field>
              <Field label="Pincode" name="pincode" inputMode="numeric" maxLength={6} value={values.pincode} onChange={handleChange} error={errors.pincode} autoComplete="postal-code" />
            </div>
          </section>
          <section>
            <h2 className="mb-5 text-2xl">Payment method</h2>
            <div className="space-y-3">
              {PAYMENTS.map(([val, label, hint]) => (
                <label key={val} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${payment === val ? 'border-olive bg-white' : 'border-sand hover:border-olive/50'}`}>
                  <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} className="mt-1 accent-[#667255]" />
                  <span><span className="block font-medium">{label}</span><span className="text-sm text-ink/60">{hint}</span></span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink/55">This is a demo checkout. No payment is taken and no order is shipped.</p>
          </section>
        </div>
        <div>
          <Summary rows={
            <ul className="mt-4 divide-y divide-sand">
              {cartItems.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3 text-sm">
                  <ProductImage src={i.product.images[0]} alt="" className="h-14 w-14 shrink-0" />
                  <span className="min-w-0 flex-1"><span className="line-clamp-2">{i.product.name}</span><span className="text-ink/55">Qty {i.qty}</span></span>
                  <span>{formatPrice(i.product.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          } />
          <button className="btn-primary mt-4 w-full py-3.5" disabled={busy}>{busy ? 'Placing your order…' : 'Place order'}</button>
        </div>
      </form>
    </>
  )
}
