import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toDateKey } from '@/lib/date'
import type { Rotina, RotinaInput } from '../types'

const ROTINAS_COL = 'rotinas'

function sortByCreatedAt(a: Rotina, b: Rotina): number {
  return (a.createdAt ?? 0) - (b.createdAt ?? 0)
}

export function subscribeRotinas(onChange: (rotinas: Rotina[]) => void): Unsubscribe {
  return onSnapshot(collection(db, ROTINAS_COL), (snap) => {
    const rotinas = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Rotina, 'id'>) }))
      .sort(sortByCreatedAt)
    onChange(rotinas)
  })
}

export async function addRotina(input: RotinaInput): Promise<void> {
  const id = Date.now().toString()
  await setDoc(doc(db, ROTINAS_COL, id), {
    ...input,
    startDate: input.startDate ?? toDateKey(new Date()),
    createdAt: Date.now(),
  })
}

export async function updateRotina(id: string, patch: Partial<RotinaInput>): Promise<void> {
  await setDoc(doc(db, ROTINAS_COL, id), patch, { merge: true })
}

export async function deleteRotina(id: string): Promise<void> {
  await deleteDoc(doc(db, ROTINAS_COL, id))
}
