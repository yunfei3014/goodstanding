export default function CalendarLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-52 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-200 rounded-xl" />
          <div className="h-9 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-9 w-9 bg-slate-100 rounded-xl" />
        <div className="h-6 w-40 bg-slate-200 rounded-lg" />
        <div className="h-9 w-9 bg-slate-100 rounded-xl" />
      </div>

      {/* Calendar grid header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="h-4 bg-slate-100 rounded mx-auto w-8" />
        ))}
      </div>

      {/* Calendar cells */}
      {[0, 1, 2, 3, 4].map((week) => (
        <div key={week} className="grid grid-cols-7 gap-1 mb-1">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div
              key={day}
              className="h-20 bg-white border border-slate-100 rounded-xl p-2"
            >
              <div className="h-4 w-5 bg-slate-100 rounded mb-1" />
              {day === 2 && week === 1 && (
                <div className="h-4 bg-amber-100 rounded text-xs" />
              )}
              {day === 4 && week === 2 && (
                <div className="h-4 bg-red-100 rounded text-xs" />
              )}
              {day === 1 && week === 3 && (
                <div className="h-4 bg-emerald-100 rounded text-xs" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
