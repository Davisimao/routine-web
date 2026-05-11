import { NavLink } from 'react-router-dom'
import { CheckSquare, CalendarDays } from 'lucide-react'
import { useRotinas } from '../context/RotinasContext'

export default function NavBar() {
  const { goToToday } = useRotinas()
  const base = 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
  const active = 'bg-indigo-600 text-white'
  const inactive = 'text-gray-600 hover:bg-gray-100'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-2xl flex items-center justify-between h-14">
        <span className="font-bold text-indigo-600 text-lg tracking-tight">Minha Rotina</span>
        <nav className="flex gap-1">
          <NavLink
            to="/"
            end
            onClick={goToToday}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            <CheckSquare size={16} />
            Hoje
          </NavLink>
          <NavLink
            to="/rotinas"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            <CalendarDays size={16} />
            Rotinas
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
