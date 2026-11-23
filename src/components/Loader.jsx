import { LeafMark } from './Logo'

export default function Loader({ full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${full ? 'fixed inset-0 z-[100] bg-ivory' : 'py-24'}`} role="status" aria-label="Loading">
      <div className="animate-breathe"><LeafMark className="h-12 w-12" /></div>
      <p className="font-display text-xl text-ink/70">EcoMart</p>
    </div>
  )
}
