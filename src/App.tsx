import React from 'react'
import { ToastProvider } from '@/components/ui/Toast'
import { MainLayout } from '@/components/layout/MainLayout'
import './index.css'

/**
 * App component - root of the WUFI Cloud application
 *
 * Wraps the application with:
 * - ToastProvider for notifications
 * - QueryClientProvider (in main.tsx)
 * - MainLayout for the main UI
 */
export function App() {
  return (
    <ToastProvider>
      <MainLayout />
    </ToastProvider>
  )
}

export default App
