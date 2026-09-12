import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { fromDateKey, isFutureDay } from '@/lib/date'
import type { ChecksPorDia } from '../types'

const CHECKS_COL = 'checks'

export function subscribeChecks(onChange: (checks: ChecksPorDia) => void): Unsubscribe {
  return onSnapshot(collection(db, CHECKS_COL), (snap) => {
    const map: ChecksPorDia = {}
    snap.docs.forEach((d) => {
      map[d.id] = d.data() as Record<string, boolean>
    })
    onChange(map)
  })
}

export async function setCheck(
  dateKey: string,
  rotinaId: string,
  concluida: boolean
): Promise<void> {
  if (isFutureDay(fromDateKey(dateKey))) return
  await setDoc(doc(db, CHECKS_COL, dateKey), { [rotinaId]: concluida }, { merge: true })
}
