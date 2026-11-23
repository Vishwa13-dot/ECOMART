import { FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { isEmail } from '../utils/validators'
import useForm from '../hooks/useForm'
import Field from '../components/Field'
import PageHeader from '../components/PageHeader'

export default function Contact() {
  const { submitMessage, notify } = useStore()
  const { values, errors, setErrors, handleChange, reset } = useForm({ name: '', email: '', subject: '', message: '' })
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (values.name.trim().length < 2) er.name = 'Enter your name.'
    if (!isEmail(values.email)) er.email = 'Enter a valid email address.'
    if (values.subject.trim().length < 3) er.subject = 'Add a short subject.'
    if (values.message.trim().length < 10) er.message = 'Write at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) return
    submitMessage(values)
    notify('Message sent. We reply within 2 working days.')
    reset()
  }
  const info = [[FiMail, 'hello@ecomart.in'], [FiPhone, '+91 79 4000 1234'], [FiMapPin, '14 Riverside Commons, Ashram Road, Ahmedabad 380009'], [FiClock, 'Mon–Sat, 10am–6pm IST']]
  return (
    <>
      <PageHeader title="Contact us">Questions about an order, a product or selling with us? Write to us.</PageHeader>
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
          <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
          <Field label="Subject" name="subject" value={values.subject} onChange={handleChange} error={errors.subject} className="sm:col-span-2" />
          <Field label="Message" name="message" as="textarea" rows={6} value={values.message} onChange={handleChange} error={errors.message} className="sm:col-span-2" />
          <div className="sm:col-span-2"><button className="btn-primary px-8">Send message</button></div>
        </form>
        <aside className="h-fit bg-cream p-7">
          <h2 className="text-2xl">Get in touch</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {info.map(([Icon, t]) => <li key={t} className="flex gap-3"><Icon className="mt-0.5 shrink-0 text-olive" /><span>{t}</span></li>)}
          </ul>
        </aside>
      </div>
    </>
  )
}
