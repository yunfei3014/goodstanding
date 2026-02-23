export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-slate-100 rounded" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-9 w-12 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                  <div>
                    <div className="h-5 w-36 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-slate-100 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="rounded-lg p-3 bg-slate-50 border border-slate-100 h-20" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-slate-100 rounded w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
