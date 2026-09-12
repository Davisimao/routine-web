import { NavLink } from 'react-router-dom'
import { CheckSquare, CalendarDays, BarChart3, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRotinas } from '@/features/rotinas/context/useRotinas'
import { Button } from '@/components/ui/button'

const BASE = 'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors'
const ACTIVE = 'bg-primary text-primary-foreground'
const INACTIVE = 'text-muted-foreground hover:bg-secondary hover:text-foreground'

function linkClass({ isActive }: { isActive: boolean }): string {
  return `${BASE} ${isActive ? ACTIVE : INACTIVE}`
}

export default function NavBar() {
  const { goToToday } = useRotinas()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4">
        <span className="font-semibold tracking-tight text-foreground">Minha Rotina</span>
        <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={dark ? 'Modo claro' : 'Modo escuro'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </header>
  )
}
