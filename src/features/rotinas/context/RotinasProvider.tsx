import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { startOfDay } from '@/lib/date'
import type { ChecksPorDia, Rotina, RotinaInput } from '../types'
import * as rotinasService from '../services/rotinasService'
import * as checksService from '../services/checksService'
import { RotinasContext, type RotinasContextValue } from './RotinasContext'

export function RotinasProvider({ children }: { children: ReactNode }) {
  const [rotinas, setRotinas] = useState<Rotina[]>([])
  const [checksPorDia, setChecksPorDia] = useState<ChecksPorDia>({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()))

  useEffect(() => {
    const unsubscribe = rotinasService.subscribeRotinas((list) => {
      setRotinas(list)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = checksService.subscribeChecks(setChecksPorDia)
    return unsubscribe
  }, [])

  const toggleCheck = useCallback(
    async (dateKey: string, rotinaId: string) => {
      const atual = Boolean(checksPorDia[dateKey]?.[rotinaId])
      await checksService.setCheck(dateKey, rotinaId, !atual)
    },
    [checksPorDia]
  )

  const addRotina = useCallback((input: RotinaInput) => rotinasService.addRotina(input), [])

  const updateRotina = useCallback(
    (id: string, patch: Partial<RotinaInput>) => rotinasService.updateRotina(id, patch),
    []
  )

  const deleteRotina = useCallback((id: string) => rotinasService.deleteRotina(id), [])

  const goToToday = useCallback(() => setSelectedDate(startOfDay(new Date())), [])

  const value = useMemo<RotinasContextValue>(
    () => ({
      rotinas,
      checksPorDia,
      loading,
      selectedDate,
      setSelectedDate,
      goToToday,
      addRotina,
      updateRotina,
      deleteRotina,
      toggleCheck,
    }),
    [
      rotinas,
      checksPorDia,
      loading,
      selectedDate,
      goToToday,
      addRotina,
      updateRotina,
      deleteRotina,
      toggleCheck,
    ]
  )

  return <RotinasContext.Provider value={value}>{children}</RotinasContext.Provider>
}
