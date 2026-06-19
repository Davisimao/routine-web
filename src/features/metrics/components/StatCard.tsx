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
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  rose: 'bg-rose-50 text-rose-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
}

export default function StatCard({ icon: Icon, label, value, sub, accent = 'indigo' }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className={`p-2 rounded-lg ${ACCENT_CLASSES[accent]}`}>
          <Icon size={18} />
        </span>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
