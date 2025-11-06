import React from 'react'
import { useUIState } from '@hooks/index'
import { MainLayout } from '@components/layout/MainLayout'
import './index.css'

export function App() {
  const ui = useUIState()

  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-50">
      <MainLayout ui={ui} />
    </div>
  )
}

export default App
