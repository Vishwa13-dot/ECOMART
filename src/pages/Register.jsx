import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { isEmail } from '../utils/validators'
import useForm from '../hooks/useForm'
import Field from '../components/Field'
import { AuthShell } from './Login'

export default function Register() {
  const { register } = useStore()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { values, errors, setErrors, handleChange } = useForm({ name: '', email: '', password: '', confirm: '' })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (values.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!isEmail(values.email)) er.email = 'Enter a valid email address.'
    if (values.password.length < 8) er.password = 'Use at least 8 characters.'
    else if (!/\d/.test(values.password) || !/[a-zA-Z]/.test(values.password)) er.password = 'Include at least one letter and one number.'
    if (values.confirm !== values.password) er.confirm = 'Passwords don’t match.'
    setErrors(er)
    if (Object.keys(er).length) return
    const res = register(values)
    if (!res.ok) { setErrors({ email: res.error }); return }
    navigate(state?.from || '/', { replace: true })
  }

  return (
    <AuthShell title="Create your account" subtitle="Save your wishlist and check out faster.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <Field label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={handleChange} error={errors.confirm} autoComplete="new-password" />
        <button className="btn-primary w-full py-3.5">Create account</button>
        <p className="text-center text-sm text-ink/65">Already have an account? <Link to="/login" state={state} className="text-olive underline">Sign in</Link></p>
        <p className="text-center text-xs text-ink/50">Demo only: accounts are stored in this browser and passwords are not encrypted.</p>
      </form>
    </AuthShell>
  )
}
