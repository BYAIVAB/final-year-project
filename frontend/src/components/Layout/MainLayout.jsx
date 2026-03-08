import React from 'react'
import GridBackground from './GridBackground'

function MainLayout({ children }) {
  return (
    <div className="fixed inset-0 bg-arc-navy font-mono flex flex-col">
      {/* Grid Background */}
      <GridBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-arc-border bg-arc-navy-light px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏥</div>
              <h1 className="text-xl font-semibold text-arc-text">
                MEDICAL AI ASSISTANT
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-arc-text-muted">
                Powered by RAG
              </div>
            </div>
          </div>
        </header>

        {/* Main Area - Takes remaining space */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
