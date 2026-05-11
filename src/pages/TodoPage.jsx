import { useState, useMemo, useRef, useEffect } from 'react'
import { useRotinas } from '../context/RotinasContext'
import ProgressBar from '../components/ProgressBar'
import MonthCalendar from '../components/MonthCalendar'
import { CheckCircle2, Circle, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const DIA_MAP = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

const DIA_LABEL = {
  seg: 'Segunda-feira',
  ter: 'Terça-feira',
  qua: 'Quarta-feira',
  qui: 'Quinta-feira',
  sex: 'Sexta-feira',
  sab: 'Sábado',
  dom: 'Domingo',
}

function startOfDay(d) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function prevDay(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return d
}

function nextDay(date) {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return d
}

export default function TodoPage() {
  const { rotinas, selectedDate, setSelectedDate } = useRotinas()
  const [checksPorDia, setChecksPorDia] = useState({})
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef(null)

  const today = startOfDay(new Date())
  const diaKey = DIA_MAP[selectedDate.getDay()]
  const isToday = isSameDay(selectedDate, today)

  const dateKey = selectedDate.toISOString().slice(0, 10)

  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
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

  function toggleCheck(id) {
    setChecksPorDia((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] ?? {}), [id]: !(prev[dateKey]?.[id]) },
    }))
  }

  function handleSelectDate(date) {
    setSelectedDate(startOfDay(date))
    setShowCalendar(false)
  }


  const dateLabel = selectedDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedDate(prevDay(selectedDate))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="px-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{DIA_LABEL[diaKey]}</h1>
              {isToday && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Hoje
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{dateLabel}</p>
          </div>

          <button
            onClick={() => setSelectedDate(nextDay(selectedDate))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

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

      {tarefasDia.length > 0 && (
        <ProgressBar done={done} total={tarefasDia.length} />
      )}

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
          {tarefasDia.map((rotina) => {
            const checked = !!checksHoje[rotina.id]
            return (
              <li
                key={rotina.id}
                onClick={() => toggleCheck(rotina.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                  checked
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {checked ? (
                    <CheckCircle2 size={22} className="text-indigo-500" />
                  ) : (
                    <Circle size={22} className="text-gray-300" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      checked ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {rotina.titulo}
                  </p>
                  {rotina.descricao && (
                    <p
                      className={`text-xs mt-0.5 ${
                        checked ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {rotina.descricao}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
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
