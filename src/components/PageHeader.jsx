export default function PageHeader({ title, children }) {
  return (
    <div className="border-b border-sand bg-cream/50">
      <div className="container-x py-10 sm:py-14">
        <h1 className="animate-fade-up text-4xl sm:text-5xl">{title}</h1>
        {children && <p className="mt-3 max-w-2xl animate-fade-up text-ink/70 [animation-delay:100ms]">{children}</p>}
      </div>
    </div>
  )
}
