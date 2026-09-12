import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isSameDay, startOfDay, weekdayKey } from '@/lib/date'
import type { Rotina } from '@/features/rotinas/types'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

interface MonthCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  rotinas: Rotina[]
}

interface DayCell {
  date: Date
  currentMonth: boolean
}

export default function MonthCalendar({ selectedDate, onSelectDate, rotinas }: MonthCalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(() => new Date(selectedDate))

  const today = startOfDay(new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7

  const days: DayCell[] = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), currentMonth: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false })
  }

  function hasRotinas(date: Date): boolean {
    const dayKey = weekdayKey(date)
    return rotinas.some((r) => r.dias.includes(dayKey))
  }

  const selDate = startOfDay(selectedDate)

  return (
    <div className="w-72 rounded-xl border border-border bg-card p-3 text-card-foreground shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map(({ date, currentMonth }, i) => {
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, selDate)
          const hasR = hasRotinas(date)

          return (
            <button
              key={i}
              onClick={() => onSelectDate(new Date(date))}
              className={`relative flex items-center justify-center h-8 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isToday
                  ? 'bg-primary/15 text-primary font-bold'
                  : currentMonth
                  ? 'text-foreground hover:bg-secondary'
                  : 'text-muted-foreground/50 hover:bg-secondary/50'
              }`}
            >
              {date.getDate()}
              {hasR && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isSelected ? 'bg-primary-foreground/60' : 'bg-primary'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
