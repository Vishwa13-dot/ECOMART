import { FiBox, FiClock, FiDroplet, FiRepeat, FiTrash2, FiPackage, FiInfo } from 'react-icons/fi'

export default function EcoInfo({ eco }) {
  const rows = [
    [FiBox, 'Material', eco.material],
    [FiRepeat, 'Reusability', eco.reusability],
    [FiClock, 'Durability', eco.durability],
    [FiPackage, 'Packaging', eco.packaging],
    [FiDroplet, 'Care instructions', eco.care],
    [FiTrash2, 'Disposal', eco.disposal],
  ]
  return (
    <section aria-labelledby="eco-h" className="bg-cream p-6 sm:p-10">
      <h2 id="eco-h" className="text-2xl sm:text-3xl">What you should know about this product</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">We list what the product is made of and how to use and dispose of it. We don&rsquo;t rank products as greener than others.</p>
      <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {rows.map(([Icon, term, text]) => (
          <div key={term} className="flex gap-3">
            <Icon className="mt-1 shrink-0 text-olive" />
            <div><dt className="font-medium">{term}</dt><dd className="mt-0.5 text-sm leading-relaxed text-ink/75">{text}</dd></div>
          </div>
        ))}
      </dl>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border-l-2 border-olive bg-ivory p-4">
          <p className="font-medium">From the seller</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">{eco.sellerNote}</p>
        </div>
        <div className="flex gap-3 border-l-2 border-sand bg-ivory p-4">
          <FiInfo className="mt-1 shrink-0 text-ink/50" />
          <div><p className="font-medium">Worth knowing</p><p className="mt-1 text-sm leading-relaxed text-ink/75">{eco.caveat}</p></div>
        </div>
      </div>
    </section>
  )
}
