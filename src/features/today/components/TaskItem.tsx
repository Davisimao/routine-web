import { CheckCircle2, Circle } from 'lucide-react'
import type { Rotina } from '@/features/rotinas/types'

interface TaskItemProps {
  rotina: Rotina
  checked: boolean
  onToggle: (id: string) => void
}

export default function TaskItem({ rotina, checked, onToggle }: TaskItemProps) {
  return (
    <li
      onClick={() => onToggle(rotina.id)}
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
        <p className={`font-medium text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {rotina.titulo}
        </p>
        {rotina.descricao && (
          <p className={`text-xs mt-0.5 ${checked ? 'text-gray-300' : 'text-gray-500'}`}>
            {rotina.descricao}
          </p>
        )}
      </div>
    </li>
  )
}
