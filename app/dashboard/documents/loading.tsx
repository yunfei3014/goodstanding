export default function DocumentsLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-44 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Search bar */}
      <div className="h-10 bg-slate-100 rounded-xl mb-6" />

      {/* Type filter pills */}
      <div className="flex gap-2 mb-6">
        {[80, 96, 60, 88, 72, 64].map((w, i) => (
          <div key={i} className={`h-7 bg-slate-100 rounded-full`} style={{ width: w }} />
        ))}
      </div>

      {/* Document rows */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-56 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
