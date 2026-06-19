import { useContext } from 'react'
import { RotinasContext, type RotinasContextValue } from './RotinasContext'

export function useRotinas(): RotinasContextValue {
  const ctx = useContext(RotinasContext)
  if (!ctx) {
    throw new Error('useRotinas deve ser usado dentro de <RotinasProvider>')
  }
  return ctx
}
