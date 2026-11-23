import { Link } from 'react-router-dom'

export default function NotFound({ message = 'That page doesn’t exist or has moved.' }) {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-ink/65">{message}</p>
      <div className="mt-8 flex justify-center gap-3"><Link to="/" className="btn-primary">Back to home</Link><Link to="/shop" className="btn-outline">Browse the shop</Link></div>
    </div>
  )
}
