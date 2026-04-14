export default function WorkflowCard({ title, timeSaved, tools, id, children }) {
  return (
    <div className="mb-12" id={id}>
      <div className="flex flex-wrap items-start gap-3 mb-5">
        <h3 className="text-white font-bold text-lg flex-1">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {timeSaved && (
            <span className="bg-zinc-800 text-teal-400 text-xs px-3 py-1 rounded-full">
              ⏱ {timeSaved}
            </span>
          )}
          {tools && (
            <span className="bg-zinc-800 text-zinc-400 text-xs px-3 py-1 rounded-full">
              🛠 {tools}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
