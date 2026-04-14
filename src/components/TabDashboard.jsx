import { useState } from 'react'

export default function TabDashboard({
  tabs,
  pageTitle,
  pageSubtitle,
  activeTab: controlledTab,
  onTabChange,
}) {
  const [internalTab, setInternalTab] = useState(tabs[0].id)
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab
  const setActiveTab = onTabChange || setInternalTab
  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div className="flex-1">
      {/* Page header */}
      {(pageTitle || pageSubtitle) && (
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-3">
          {pageTitle && (
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {pageTitle}
            </h1>
          )}
          {pageSubtitle && (
            <p className="text-zinc-400 mt-2 text-base">{pageSubtitle}</p>
          )}
        </div>
      )}

      {/* Sticky tab bar — sits just below the 60px navbar */}
      <div className="sticky top-[60px] z-40 bg-[#111118] border-b border-zinc-800 px-4 py-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap'
                : 'text-zinc-400 hover:text-white px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-24">{activeContent}</div>
    </div>
  )
}
