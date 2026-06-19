import { createContext } from 'react'
import type { ChecksPorDia, Rotina, RotinaInput } from '../types'

export interface RotinasContextValue {
  rotinas: Rotina[]
  checksPorDia: ChecksPorDia
  loading: boolean
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  goToToday: () => void
  addRotina: (input: RotinaInput) => Promise<void>
  updateRotina: (id: string, patch: Partial<RotinaInput>) => Promise<void>
  deleteRotina: (id: string) => Promise<void>
  toggleCheck: (dateKey: string, rotinaId: string) => Promise<void>
}

export const RotinasContext = createContext<RotinasContextValue | null>(null)
