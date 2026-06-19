import { NavLink } from 'react-router-dom'
import { CheckSquare, CalendarDays, BarChart3 } from 'lucide-react'
import { useRotinas } from '@/features/rotinas/context/useRotinas'

const BASE = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
const ACTIVE = 'bg-indigo-600 text-white'
const INACTIVE = 'text-gray-600 hover:bg-gray-100'

function linkClass({ isActive }: { isActive: boolean }): string {
  return `${BASE} ${isActive ? ACTIVE : INACTIVE}`
}

export default function NavBar() {
  const { goToToday } = useRotinas()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-2xl flex items-center justify-between h-14">
        <span className="font-bold text-indigo-600 text-lg tracking-tight">Minha Rotina</span>
        <nav className="flex gap-1">
          <NavLink to="/" end onClick={goToToday} className={linkClass}>
            <CheckSquare size={16} />
            Hoje
          </NavLink>
          <NavLink to="/rotinas" className={linkClass}>
            <CalendarDays size={16} />
            Rotinas
          </NavLink>
          <NavLink to="/metricas" className={linkClass}>
            <BarChart3 size={16} />
            Métricas
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
