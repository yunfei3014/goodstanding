export default function SettingsLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-7 w-28 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded" />
      </div>

      {/* Plan banner */}
      <div className="bg-[#1B2B4B]/20 rounded-xl h-24 mb-6" />

      {/* Section cards */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-4 h-4 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-200 rounded" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
            {i <= 2 && (
              <div>
                <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
