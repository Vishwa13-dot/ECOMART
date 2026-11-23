import { FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex max-w-[calc(100vw-2.5rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex animate-slide-in items-center gap-3 rounded-sm border border-sand bg-white px-4 py-3 text-sm shadow-lift">
          {t.type === 'success' ? <FiCheck className="text-olive" /> : t.type === 'error' ? <FiAlertCircle className="text-red-600" /> : <FiInfo className="text-ink/50" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
