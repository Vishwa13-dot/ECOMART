export default function AdminHeading({ title, children, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-3xl">{title}</h1>{children && <p className="mt-1 text-sm text-ink/60">{children}</p>}</div>
      {action}
    </div>
  )
}
