import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useRotinas } from '@/features/rotinas/context/useRotinas'
import { startOfDay, toDateKey, weekdayKey, isSameDay, isFutureDay } from '@/lib/date'
import { isScheduled } from '@/features/metrics/services/metricsCalculator'
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
  const isFuture = isFutureDay(selectedDate)
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
    () => rotinas.filter((r) => isScheduled(r, selectedDate)),
    [rotinas, selectedDate]
  )

  const checksHoje = checksPorDia[dateKey] ?? {}
  const done = tarefasDia.filter((r) => checksHoje[r.id]).length

  function handleSelectDate(date: Date) {
    setSelectedDate(startOfDay(date))
    setShowCalendar(false)
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
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

      <div className="mb-6 flex items-start justify-between">
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
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <CalendarDays size={48} className="mb-3 text-muted-foreground/40" />
          <p className="text-base font-medium text-foreground">Dia livre!</p>
          <p className="mt-1 text-sm text-muted-foreground">
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
              disabled={isFuture}
              onToggle={(id) => void toggleCheck(dateKey, id)}
            />
          ))}
        </ul>
      )}

      {done === tarefasDia.length && tarefasDia.length > 0 && (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">🎉 Todas as tarefas concluídas!</p>
        </div>
      )}
    </div>
  )
}
