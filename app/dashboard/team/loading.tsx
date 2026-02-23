export default function TeamLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-28 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Team member rows */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 mb-3 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg" />
        </div>
      ))}

      {/* Invite link section */}
      <div className="bg-slate-50 rounded-2xl p-6 mt-6">
        <div className="h-4 w-36 bg-slate-200 rounded mb-3" />
        <div className="h-10 bg-white rounded-xl border border-slate-200" />
      </div>
    </div>
  )
}
