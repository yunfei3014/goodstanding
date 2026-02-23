export default function ReportLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-52 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Report card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Header strip */}
        <div className="h-40 bg-slate-200" />

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-6 flex flex-col items-center gap-2">
              <div className="h-7 w-10 bg-slate-200 rounded-lg" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-10 bg-slate-200 rounded" />
          </div>
          <div className="h-2 bg-slate-100 rounded-full" />
        </div>

        {/* Filing breakdown rows */}
        <div className="px-8 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-slate-100 rounded-lg" />
              <div className="h-4 bg-slate-100 rounded flex-1" />
              <div className="h-4 w-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
