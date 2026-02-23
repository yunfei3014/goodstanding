export default function CompanyDetailLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-slate-200 rounded mb-6" />

      {/* Company header card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex-shrink-0" />
            <div>
              <div className="h-6 w-48 bg-slate-200 rounded-lg mb-2" />
              <div className="h-4 w-36 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-slate-100 rounded-xl" />
            <div className="h-9 w-24 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex gap-6 mt-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Score + stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full mb-3" />
          <div className="h-5 w-16 bg-slate-200 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
            <div className="h-8 w-10 bg-slate-200 rounded-lg mb-2" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Recent filings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50">
            <div className="w-6 h-6 bg-slate-100 rounded-full" />
            <div className="flex-1 h-4 bg-slate-100 rounded" />
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
