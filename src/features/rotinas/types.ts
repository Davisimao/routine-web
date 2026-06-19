export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'

export interface Rotina {
  id: string
  titulo: string
  descricao?: string
  dias: DiaSemana[]
  createdAt?: number
}

export type RotinaInput = Omit<Rotina, 'id' | 'createdAt'>

/** Mapa de conclusões: dateKey -> rotinaId -> concluída. */
export type ChecksPorDia = Record<string, Record<string, boolean>>
