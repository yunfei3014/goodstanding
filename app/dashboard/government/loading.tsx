export default function GovernmentLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-56 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {["bg-blue-50", "bg-amber-50", "bg-emerald-50", "bg-slate-100"].map((bg, i) => (
          <div key={i} className={`${bg} rounded-2xl p-5`}>
            <div className="h-8 w-10 bg-white/60 rounded-lg mb-2" />
            <div className="h-3 w-16 bg-white/60 rounded" />
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="h-4 w-32 bg-slate-200 rounded mb-3" />

      {/* Interaction cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded mt-3" />
              <div className="h-3 w-5/6 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
