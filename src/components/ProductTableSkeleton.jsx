export default function ProductTableSkeleton({ rows = 10 }) {
  return (
    <div className="hidden sm:block">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium sm:px-6">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium sm:pr-6" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-10 w-10 rounded-md" />
                  <div className="skeleton h-4 w-40 rounded" />
                </div>
              </td>
              <td className="px-4 py-3"><div className="skeleton h-4 w-20 rounded" /></td>
              <td className="px-4 py-3"><div className="skeleton h-4 w-12 rounded" /></td>
              <td className="px-4 py-3"><div className="skeleton h-4 w-14 rounded" /></td>
              <td className="px-4 py-3"><div className="skeleton h-5 w-20 rounded-full" /></td>
              <td className="px-4 py-3 sm:pr-6" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
