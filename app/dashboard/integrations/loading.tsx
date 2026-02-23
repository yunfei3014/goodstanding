export default function IntegrationsLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-40 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-slate-100 rounded" />
      </div>

      {/* Section label */}
      <div className="h-3 w-24 bg-slate-200 rounded mb-3" />

      {/* Integration cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 mb-3 flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-100 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-100 rounded" />
          </div>
          <div className="w-9 h-5 bg-slate-100 rounded-full" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
      ))}

      {/* Coming soon label */}
      <div className="h-3 w-28 bg-slate-200 rounded mb-3 mt-6" />

      {/* Coming soon cards */}
      {[1, 2].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 mb-3 flex items-center gap-4 opacity-60">
          <div className="w-11 h-11 bg-slate-100 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
      ))}
    </div>
  )
}
