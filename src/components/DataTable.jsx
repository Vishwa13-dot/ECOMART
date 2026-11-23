export default function DataTable({ columns, rows, empty = 'Nothing here yet.', rowKey = (r) => r.id }) {
  if (!rows.length) return <p className="border border-sand bg-white py-12 text-center text-sm text-ink/60">{empty}</p>
  return (
    <div className="overflow-x-auto border border-sand bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-sand bg-cream/60 text-ink/70">
          <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-sand">
          {rows.map((r) => (
            <tr key={rowKey(r)} className="align-middle transition hover:bg-ivory">
              {columns.map((c) => <td key={c.key} className="px-4 py-3">{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
