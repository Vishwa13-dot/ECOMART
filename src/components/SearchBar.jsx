import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search products', className = '', autoFocus = false }) {
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSubmit?.(value) }} className={`relative ${className}`}>
      <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        aria-label={placeholder} autoFocus={autoFocus} className="input pl-11"
      />
    </form>
  )
}
