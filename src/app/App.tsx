import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from '@/shared/layout/NavBar'
import TodoPage from '@/features/today/pages/TodoPage'
import RotinasPage from '@/features/rotinas/pages/RotinasPage'
import MetricsPage from '@/features/metrics/pages/MetricsPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/rotinas" element={<RotinasPage />} />
          <Route path="/metricas" element={<MetricsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
