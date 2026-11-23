export default function Field({ label, error, as: Tag = 'input', className = '', children, ...props }) {
  const id = props.id || props.name
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      <Tag id={id} aria-invalid={!!error} className={`input ${error ? '!border-red-400' : ''}`} {...props}>{children}</Tag>
      {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  )
}
