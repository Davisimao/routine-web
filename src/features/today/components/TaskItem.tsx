import { CheckCircle2, Circle } from 'lucide-react'
import type { Rotina } from '@/features/rotinas/types'

interface TaskItemProps {
  rotina: Rotina
  checked: boolean
  disabled?: boolean
  onToggle: (id: string) => void
}

export default function TaskItem({ rotina, checked, disabled = false, onToggle }: TaskItemProps) {
  return (
    <li
      onClick={() => {
        if (!disabled) onToggle(rotina.id)
      }}
      className={`flex items-start gap-3 p-4 rounded-xl border select-none transition-all ${
        disabled ? 'bg-muted border-border cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${
        checked
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      <span className="mt-0.5 flex-shrink-0">
        {checked ? (
          <CheckCircle2 size={22} className="text-primary" />
        ) : (
          <Circle size={22} className="text-muted-foreground/50" />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {rotina.emoji && <span className="mr-2">{rotina.emoji}</span>}
          {rotina.titulo}
        </p>
        {rotina.descricao && (
          <p className={`mt-0.5 text-xs ${checked ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {rotina.descricao}
          </p>
        )}
        {disabled && <span className="text-xs text-muted-foreground">Disponível hoje</span>}
      </div>
    </li>
  )
}
