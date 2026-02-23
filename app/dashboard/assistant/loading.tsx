export default function AssistantLoading() {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] p-4 sm:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="h-7 w-56 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-slate-100 rounded" />
      </div>

      {/* Context pill */}
      <div className="h-10 bg-slate-100 rounded-xl mb-4 flex-shrink-0" />

      {/* Chat area */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {/* Assistant message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-slate-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 max-w-sm">
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
            <div className="h-4 bg-slate-100 rounded w-4/6" />
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="h-10 w-48 bg-slate-100 rounded-2xl" />
        </div>

        {/* Assistant message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-slate-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 max-w-md">
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="h-12 bg-slate-100 rounded-2xl mt-4 flex-shrink-0" />
    </div>
  )
}
