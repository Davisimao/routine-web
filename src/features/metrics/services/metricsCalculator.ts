import { addDays, fromDateKey, startOfDay, toDateKey, weekdayKey } from '@/lib/date'
import type { ChecksPorDia, Rotina } from '@/features/rotinas/types'

export interface ProgressoHoje {
  feitas: number
  total: number
}

export function isScheduled(rotina: Rotina, date: Date): boolean {
  return rotina.dias.includes(weekdayKey(date))
}

function isChecked(checks: ChecksPorDia, key: string, rotinaId: string): boolean {
  return Boolean(checks[key]?.[rotinaId])
}

/** Chaves de dias com registro, em ordem crescente. */
function checkedDateKeys(checks: ChecksPorDia): string[] {
  return Object.keys(checks).sort()
}

// ---- Visão geral ----

/**
 * Um "dia perfeito" é um dia (com ao menos uma rotina agendada) em que todas as
 * rotinas agendadas foram concluídas.
 */
export function diasPerfeitos(rotinas: Rotina[], checks: ChecksPorDia): number {
  let count = 0
  for (const key of checkedDateKeys(checks)) {
    const date = fromDateKey(key)
    const agendadas = rotinas.filter((r) => isScheduled(r, date))
    if (agendadas.length === 0) continue
    const todasFeitas = agendadas.every((r) => isChecked(checks, key, r.id))
    if (todasFeitas) count++
  }
  return count
}

/** Maior sequência de dias perfeitos consecutivos (apenas dias com rotina agendada). */
export function melhorSequenciaGeral(rotinas: Rotina[], checks: ChecksPorDia): number {
  if (rotinas.length === 0) return 0
  const keys = checkedDateKeys(checks)
  if (keys.length === 0) return 0

  const start = fromDateKey(keys[0])
  const end = fromDateKey(keys[keys.length - 1])

  let best = 0
  let current = 0
  let cursor = start
  while (cursor <= end) {
    const key = toDateKey(cursor)
    const agendadas = rotinas.filter((r) => isScheduled(r, cursor))
    if (agendadas.length > 0) {
      const perfeito = agendadas.every((r) => isChecked(checks, key, r.id))
      if (perfeito) {
        current++
        best = Math.max(best, current)
      } else {
        current = 0
      }
    }
    cursor = addDays(cursor, 1)
  }
  return best
}

export function metasConcluidasHoje(
  rotinas: Rotina[],
  checks: ChecksPorDia,
  hoje: Date = new Date()
): ProgressoHoje {
  const key = toDateKey(hoje)
  const agendadas = rotinas.filter((r) => isScheduled(r, hoje))
  const feitas = agendadas.filter((r) => isChecked(checks, key, r.id)).length
  return { feitas, total: agendadas.length }
}

// ---- Por meta ----

/**
 * Sequência atual: dias agendados consecutivos cumpridos, terminando no último dia
 * agendado <= hoje. Se o último dia agendado não foi cumprido, retorna 0.
 */
export function sequenciaAtual(
  rotina: Rotina,
  checks: ChecksPorDia,
  hoje: Date = new Date()
): number {
  let current = 0
  let cursor = startOfDay(hoje)
  const limite = new Date(cursor)
  limite.setFullYear(limite.getFullYear() - 2)

  let encontrou = false
  while (cursor >= limite) {
    if (isScheduled(rotina, cursor)) {
      encontrou = true
      break
    }
    cursor = addDays(cursor, -1)
  }
  if (!encontrou) return 0

  while (cursor >= limite) {
    if (isScheduled(rotina, cursor)) {
      if (isChecked(checks, toDateKey(cursor), rotina.id)) {
        current++
      } else {
        break
      }
    }
    cursor = addDays(cursor, -1)
  }
  return current
}

export function melhorSequencia(rotina: Rotina, checks: ChecksPorDia): number {
  const keys = checkedDateKeys(checks)
  if (keys.length === 0) return 0
  const start = fromDateKey(keys[0])
  const end = startOfDay(new Date())

  let best = 0
  let current = 0
  let cursor = start
  while (cursor <= end) {
    if (isScheduled(rotina, cursor)) {
      if (isChecked(checks, toDateKey(cursor), rotina.id)) {
        current++
        best = Math.max(best, current)
      } else {
        current = 0
      }
    }
    cursor = addDays(cursor, 1)
  }
  return best
}

export function volumeTotal(rotina: Rotina, checks: ChecksPorDia): number {
  let count = 0
  for (const key of Object.keys(checks)) {
    if (isChecked(checks, key, rotina.id)) count++
  }
  return count
}

export function diasSucessoAno(
  rotina: Rotina,
  checks: ChecksPorDia,
  ano: number = new Date().getFullYear()
): number {
  let count = 0
  for (const key of Object.keys(checks)) {
    if (key.startsWith(`${ano}-`) && isChecked(checks, key, rotina.id)) count++
  }
  return count
}

/** Conta dias agendados num intervalo [inicio, fim] inclusive. */
function diasAgendadosNoIntervalo(rotina: Rotina, inicio: Date, fim: Date): number {
  let count = 0
  let cursor = inicio
  while (cursor <= fim) {
    if (isScheduled(rotina, cursor)) count++
    cursor = addDays(cursor, 1)
  }
  return count
}

/** Média diária = % de dias agendados cumpridos desde o primeiro registro até hoje. */
export function mediaDiaria(rotina: Rotina, checks: ChecksPorDia): number {
  const keys = checkedDateKeys(checks)
  if (keys.length === 0) return 0
  const inicio = fromDateKey(keys[0])
  const fim = startOfDay(new Date())
  const agendados = diasAgendadosNoIntervalo(rotina, inicio, fim)
  if (agendados === 0) return 0
  const feitos = volumeTotal(rotina, checks)
  return Math.round((feitos / agendados) * 100)
}

/** Taxa mensal = % de dias agendados cumpridos no mês corrente (até hoje). */
export function taxaMensal(
  rotina: Rotina,
  checks: ChecksPorDia,
  ano: number = new Date().getFullYear(),
  mes: number = new Date().getMonth()
): number {
  const inicio = new Date(ano, mes, 1)
  const hoje = startOfDay(new Date())
  const ultimoDiaMes = new Date(ano, mes + 1, 0)
  const fim = hoje < ultimoDiaMes ? hoje : ultimoDiaMes
  if (fim < inicio) return 0
  const agendados = diasAgendadosNoIntervalo(rotina, inicio, fim)
  if (agendados === 0) return 0
  let feitos = 0
  let cursor = inicio
  while (cursor <= fim) {
    if (isScheduled(rotina, cursor) && isChecked(checks, toDateKey(cursor), rotina.id)) {
      feitos++
    }
    cursor = addDays(cursor, 1)
  }
  return Math.round((feitos / agendados) * 100)
}
