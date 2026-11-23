import { Link } from 'react-router-dom'

export function LeafMark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" fill="#667255" />
      <path d="M9 23c0-8 5-13 14-14 0 9-5 14-13 14z" fill="#FAF7F2" />
      <path d="M9 23c4-5 8-8 12-10" stroke="#667255" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="EcoMart home">
      <LeafMark />
      <span className="font-display text-2xl leading-none text-ink">EcoMart</span>
    </Link>
  )
}
