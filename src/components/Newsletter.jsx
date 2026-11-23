import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { isEmail } from '../utils/validators'
import Reveal from './Reveal'

export default function Newsletter() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!isEmail(email)) { setError('Enter a valid email address.'); return }
    setError(''); setEmail(''); notify('You\u2019re subscribed. Look out for our next note.')
  }
  return (
    <section className="bg-cream">
      <Reveal className="container-x grid items-center gap-8 py-16 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="text-3xl sm:text-4xl">One useful email a month</h2>
          <p className="mt-3 max-w-md text-ink/70">New makers, restocks and plain-language guides to caring for what you buy. No spam, unsubscribe anytime.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" className="input flex-1" />
            <button className="btn-primary">Subscribe</button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
        </form>
      </Reveal>
    </section>
  )
}
