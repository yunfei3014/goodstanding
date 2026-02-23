export default function ActivityLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-40 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6">
        {[60, 80, 72, 88, 64].map((w, i) => (
          <div key={i} className="h-7 bg-slate-100 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* Activity feed */}
      <div className="space-y-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-start gap-4 py-4 border-b border-slate-50">
            <div className="w-8 h-8 bg-slate-100 rounded-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-slate-200 rounded" style={{ width: `${50 + (i * 7) % 40}%` }} />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
            <div className="h-3 w-20 bg-slate-100 rounded flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
