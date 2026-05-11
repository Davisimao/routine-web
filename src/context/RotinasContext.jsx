import { createContext, useContext, useState } from 'react'

const RotinasContext = createContext(null)

const initialRotinas = [
  {
    id: '1',
    titulo: 'Exercício físico',
    descricao: 'Treino de 30 minutos',
    dias: ['seg', 'ter', 'qua', 'qui', 'sex'],
  },
  {
    id: '2',
    titulo: 'Leitura',
    descricao: 'Ler pelo menos 20 páginas',
    dias: ['seg', 'qua', 'sex', 'sab', 'dom'],
  },
]

function startOfDay(d) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

export function RotinasProvider({ children }) {
  const [rotinas, setRotinas] = useState(initialRotinas)
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))

  function addRotina(rotina) {
    setRotinas((prev) => [
      ...prev,
      { ...rotina, id: Date.now().toString() },
    ])
  }

  function updateRotina(id, rotina) {
    setRotinas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...rotina } : r))
    )
  }

  function deleteRotina(id) {
    setRotinas((prev) => prev.filter((r) => r.id !== id))
  }

  function goToToday() {
    setSelectedDate(startOfDay(new Date()))
  }

  return (
    <RotinasContext.Provider value={{ rotinas, addRotina, updateRotina, deleteRotina, selectedDate, setSelectedDate, goToToday }}>
      {children}
    </RotinasContext.Provider>
  )
}

export function useRotinas() {
  return useContext(RotinasContext)
}
