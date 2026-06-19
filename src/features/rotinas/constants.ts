import type { DiaSemana } from './types'

export const DIA_ORDER: DiaSemana[] = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

export const DIA_LABEL_CURTO: Record<DiaSemana, string> = {
  seg: 'Seg',
  ter: 'Ter',
  qua: 'Qua',
  qui: 'Qui',
  sex: 'Sex',
  sab: 'Sáb',
  dom: 'Dom',
}

export const DIA_LABEL_LONGO: Record<DiaSemana, string> = {
  seg: 'Segunda-feira',
  ter: 'Terça-feira',
  qua: 'Quarta-feira',
  qui: 'Quinta-feira',
  sex: 'Sexta-feira',
  sab: 'Sábado',
  dom: 'Domingo',
}

export const DIAS: ReadonlyArray<{ key: DiaSemana; label: string }> = DIA_ORDER.map((key) => ({
  key,
  label: DIA_LABEL_CURTO[key],
}))
