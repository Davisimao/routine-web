import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays } from '@/lib/date'
import { DIA_LABEL_LONGO } from '@/features/rotinas/constants'
import type { DiaSemana } from '@/features/rotinas/types'

interface DayNavigatorProps {
  selectedDate: Date
  diaKey: DiaSemana
  isToday: boolean
  onChange: (date: Date) => void
}

export default function DayNavigator({ selectedDate, diaKey, isToday, onChange }: DayNavigatorProps) {
  const dateLabel = selectedDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(addDays(selectedDate, -1))}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="px-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">{DIA_LABEL_LONGO[diaKey]}</h1>
          {isToday && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              Hoje
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{dateLabel}</p>
      </div>

      <button
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
