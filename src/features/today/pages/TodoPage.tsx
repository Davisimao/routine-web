import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useRotinas } from '@/features/rotinas/context/useRotinas'
import { startOfDay, toDateKey, weekdayKey, isSameDay } from '@/lib/date'
import ProgressBar from '@/shared/components/ProgressBar'
import MonthCalendar from '@/shared/components/MonthCalendar'
import DayNavigator from '../components/DayNavigator'
import TaskItem from '../components/TaskItem'

export default function TodoPage() {
  const { rotinas, checksPorDia, toggleCheck, selectedDate, setSelectedDate } = useRotinas()
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const today = startOfDay(new Date())
  const diaKey = weekdayKey(selectedDate)
  const isToday = isSameDay(selectedDate, today)
  const dateKey = toDateKey(selectedDate)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tarefasDia = useMemo(
    () => rotinas.filter((r) => r.dias.includes(diaKey)),
    [rotinas, diaKey]
  )

  const checksHoje = checksPorDia[dateKey] ?? {}
  const done = tarefasDia.filter((r) => checksHoje[r.id]).length

  function handleSelectDate(date: Date) {
    setSelectedDate(startOfDay(date))
    setShowCalendar(false)
  }

  return (
    <div>
      <div className="bg-indigo-600 text-white rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
        <CalendarDays size={20} className="flex-shrink-0 opacity-80" />
        <div>
          <p className="text-xs font-medium opacity-75 uppercase tracking-wide">
            {isToday ? 'Hoje' : 'Visualizando'}
          </p>
          <p className="font-semibold text-sm capitalize">
            {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between mb-6">
        <DayNavigator
          selectedDate={selectedDate}
          diaKey={diaKey}
          isToday={isToday}
          onChange={setSelectedDate}
        />

        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => setShowCalendar((v) => !v)}
            className={`p-2 rounded-lg transition-colors ${
              showCalendar
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            title="Abrir calendário"
          >
            <CalendarDays size={20} />
          </button>

          {showCalendar && (
            <div className="absolute right-0 mt-1 z-20">
              <MonthCalendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                rotinas={rotinas}
              />
            </div>
          )}
        </div>
      </div>

      {tarefasDia.length > 0 && <ProgressBar done={done} total={tarefasDia.length} />}

      {tarefasDia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <CalendarDays size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium">Dia livre!</p>
          <p className="text-sm mt-1">
            Nenhuma rotina cadastrada para {isToday ? 'hoje' : 'este dia'}.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tarefasDia.map((rotina) => (
            <TaskItem
              key={rotina.id}
              rotina={rotina}
              checked={Boolean(checksHoje[rotina.id])}
              onToggle={(id) => void toggleCheck(dateKey, id)}
            />
          ))}
        </ul>
      )}

      {done === tarefasDia.length && tarefasDia.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold text-sm">🎉 Todas as tarefas concluídas!</p>
        </div>
      )}
    </div>
  )
}
