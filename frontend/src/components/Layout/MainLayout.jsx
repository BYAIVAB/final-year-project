import React from 'react'
import GridBackground from './GridBackground'

function MainLayout({ children }) {
  return (
    <div className="relative h-screen overflow-hidden bg-arc-navy font-mono">
      {/* Grid Background */}
      <GridBackground />
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-arc-border bg-arc-navy-light px-6 py-4">
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

        {/* Main Area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
