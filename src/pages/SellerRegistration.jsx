import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { isEmail, isPhone } from '../utils/validators'
import useForm from '../hooks/useForm'
import Field from '../components/Field'
import PageHeader from '../components/PageHeader'

const initial = { sellerName: '', business: '', email: '', phone: '', category: '', description: '', products: '' }

export default function SellerRegistration() {
  const { categories, submitSellerApp, notify } = useStore()
  const { values, errors, setErrors, handleChange, reset } = useForm(initial)
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (values.sellerName.trim().length < 2) er.sellerName = 'Enter your name.'
    if (values.business.trim().length < 2) er.business = 'Enter your business name.'
    if (!isEmail(values.email)) er.email = 'Enter a valid email address.'
    if (!isPhone(values.phone)) er.phone = 'Enter a 10-digit Indian mobile number.'
    if (!values.category) er.category = 'Choose a category.'
    if (values.description.trim().length < 20) er.description = 'Tell us a little more (at least 20 characters).'
    if (values.products.trim().length < 5) er.products = 'List the products you plan to sell.'
    setErrors(er)
    if (Object.keys(er).length) { notify('Please fix the highlighted fields', 'error'); return }
    submitSellerApp(values)
    setDone(true); reset()
  }

  if (done) {
    return (
      <div className="container-x max-w-xl py-24 text-center animate-fade-in">
        <h1 className="text-4xl">Application received</h1>
        <p className="mt-4 text-ink/70">Thank you. Our team reviews every application and will reply to your email within 5 working days.</p>
        <div className="mt-8 flex justify-center gap-3"><Link to="/" className="btn-primary">Back to home</Link><button className="btn-outline" onClick={() => setDone(false)}>Submit another</button></div>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Sell on EcoMart">Tell us about your business. We look for clear product information and honest sustainability claims.</PageHeader>
      <form onSubmit={submit} noValidate className="container-x grid max-w-3xl gap-5 py-14 sm:grid-cols-2">
        <Field label="Your name" name="sellerName" value={values.sellerName} onChange={handleChange} error={errors.sellerName} />
        <Field label="Business name" name="business" value={values.business} onChange={handleChange} error={errors.business} />
        <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
        <Field label="Phone" name="phone" type="tel" value={values.phone} onChange={handleChange} error={errors.phone} />
        <Field label="Business category" name="category" as="select" value={values.category} onChange={handleChange} error={errors.category} className="sm:col-span-2">
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Field>
        <Field label="About your business" name="description" as="textarea" rows={4} value={values.description} onChange={handleChange} error={errors.description} className="sm:col-span-2" />
        <Field label="Product information (what you make, materials, price range)" name="products" as="textarea" rows={4} value={values.products} onChange={handleChange} error={errors.products} className="sm:col-span-2" />
        <div className="sm:col-span-2"><button className="btn-primary px-8">Submit application</button></div>
      </form>
    </>
  )
}
