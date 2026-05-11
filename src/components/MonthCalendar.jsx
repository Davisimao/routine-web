import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DIA_MAP = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function MonthCalendar({ selectedDate, onSelectDate, rotinas }) {
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const firstDayOfWeek = (firstDay.getDay() + 6) % 7

  const days = []
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

  function hasRotinas(date) {
    const dayKey = DIA_MAP[date.getDay()]
    return rotinas.some((r) => r.dias.includes(dayKey))
  }

  const selDate = new Date(selectedDate)
  selDate.setHours(0, 0, 0, 0)

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-72">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-sm text-gray-800">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
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
                  ? 'bg-indigo-600 text-white'
                  : isToday
                  ? 'bg-indigo-100 text-indigo-700 font-bold'
                  : currentMonth
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-300 hover:bg-gray-50'
              }`}
            >
              {date.getDate()}
              {hasR && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isSelected ? 'bg-white/60' : 'bg-indigo-400'
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
