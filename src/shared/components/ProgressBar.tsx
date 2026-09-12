import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  done: number
  total: number
}

export default function ProgressBar({ done, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-muted-foreground">Progresso do dia</span>
        <span className="text-sm font-semibold text-primary">
          {done}/{total} ({pct}%)
        </span>
      </div>
      <Progress value={pct} className="h-3" />
    </div>
  )
}
