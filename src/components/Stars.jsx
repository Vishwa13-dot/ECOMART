import { FiStar } from 'react-icons/fi'

export default function Stars({ value = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-olive" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar key={i} size={size} className={value >= i - 0.25 ? 'fill-current' : value >= i - 0.75 ? 'fill-current opacity-50' : 'opacity-40'} />
      ))}
    </span>
  )
}
