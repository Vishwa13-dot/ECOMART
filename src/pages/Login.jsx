import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { isEmail } from '../utils/validators'
import useForm from '../hooks/useForm'
import Field from '../components/Field'
import SiteImage from '../components/SiteImage'

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      <div className="hidden lg:block"><SiteImage slot="auth" className="h-full w-full" /></div>
      <div className="flex items-center px-5 py-14 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl">{title}</h1>
          <p className="mt-2 text-ink/65">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { values, setValues, errors, setErrors, handleChange } = useForm({ email: '', password: '' })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!isEmail(values.email)) er.email = 'Enter a valid email address.'
    if (!values.password) er.password = 'Enter your password.'
    setErrors(er)
    if (Object.keys(er).length) return
    const res = login(values.email, values.password)
    if (!res.ok) { setErrors({ form: res.error }); return }
    navigate(res.user.role === 'admin' && !state?.from ? '/admin' : state?.from || '/', { replace: true })
  }

  return (
    <AuthShell title="Sign in" subtitle="Welcome back. Pick up where you left off.">
      <form onSubmit={submit} noValidate className="space-y-5">
        {state?.adminOnly && <p className="bg-cream px-4 py-3 text-sm">Sign in with an admin account to open the dashboard.</p>}
        {errors.form && <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.form}</p>}
        <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <button className="btn-primary w-full py-3.5">Sign in</button>
        <p className="text-center text-sm text-ink/65">New to EcoMart? <Link to="/register" state={state} className="text-olive underline">Create an account</Link></p>
      </form>
      <div className="mt-8 border border-sand bg-cream/60 p-4 text-sm">
        <p className="font-medium">Demo accounts</p>
        <p className="mt-1 text-ink/70">Admin: admin@ecomart.in / admin123<br />Customer: aarav@example.com / demo1234</p>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-outline btn-sm" onClick={() => setValues({ email: 'admin@ecomart.in', password: 'admin123' })}>Fill admin</button>
          <button type="button" className="btn-outline btn-sm" onClick={() => setValues({ email: 'aarav@example.com', password: 'demo1234' })}>Fill customer</button>
        </div>
      </div>
    </AuthShell>
  )
}
