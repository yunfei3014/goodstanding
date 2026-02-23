export default function BillingLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-32 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-56 bg-slate-100 rounded" />
      </div>

      {/* Current plan card */}
      <div className="bg-[#1B2B4B]/20 rounded-2xl h-36 mb-6" />

      {/* Pricing cards grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="h-5 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-7 w-20 bg-slate-200 rounded mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-100 rounded-full" />
                  <div className="h-3 bg-slate-100 rounded flex-1" />
                </div>
              ))}
            </div>
            <div className="h-9 bg-slate-100 rounded-xl mt-4" />
          </div>
        ))}
      </div>

      {/* Invoice history */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="h-4 w-36 bg-slate-200 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 bg-slate-100 rounded flex-1" />
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
            <div className="h-4 w-14 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
