import type { LucideIcon } from 'lucide-react'

export type StatAccent = 'indigo' | 'amber' | 'green' | 'rose' | 'sky' | 'violet'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  accent?: StatAccent
}

const ACCENT_CLASSES: Record<StatAccent, string> = {
  indigo: 'bg-primary/10 text-primary',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  sky: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
}

export default function StatCard({ icon: Icon, label, value, sub, accent = 'indigo' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className={`p-2 rounded-lg ${ACCENT_CLASSES[accent]}`}>
          <Icon size={18} />
        </span>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}
