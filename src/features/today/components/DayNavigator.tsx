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
        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="px-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">{DIA_LABEL_LONGO[diaKey]}</h1>
          {isToday && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Hoje
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-0.5">{dateLabel}</p>
      </div>

      <button
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
