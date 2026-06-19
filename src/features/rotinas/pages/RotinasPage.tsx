import { useState } from 'react'
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { useRotinas } from '../context/useRotinas'
import RotinaForm from '../components/RotinaForm'
import { DIA_LABEL_CURTO, DIA_ORDER } from '../constants'
import type { Rotina, RotinaInput } from '../types'

export default function RotinasPage() {
  const { rotinas, addRotina, updateRotina, deleteRotina } = useRotinas()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Rotina | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleSave(form: RotinaInput) {
    if (editing) {
      void updateRotina(editing.id, form)
      setEditing(null)
    } else {
      void addRotina(form)
      setShowForm(false)
    }
  }

  function handleEdit(rotina: Rotina) {
    setEditing(rotina)
    setShowForm(false)
  }

  function handleDelete(id: string) {
    void deleteRotina(id)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rotinas</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {rotinas.length} rotina{rotinas.length !== 1 ? 's' : ''} cadastrada
            {rotinas.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Nova rotina
          </button>
        )}
      </div>

      {showForm && <RotinaForm onSave={handleSave} onCancel={() => setShowForm(false)} />}

      {editing && (
        <RotinaForm
          initial={{ titulo: editing.titulo, descricao: editing.descricao, dias: editing.dias }}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {rotinas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <CalendarDays size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium">Nenhuma rotina ainda</p>
          <p className="text-sm mt-1">Clique em "Nova rotina" para começar.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rotinas.map((rotina) => (
            <li key={rotina.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{rotina.titulo}</p>
                  {rotina.descricao && (
                    <p className="text-xs text-gray-500 mt-0.5">{rotina.descricao}</p>
                  )}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {DIA_ORDER.filter((d) => rotina.dias.includes(d)).map((dia) => (
                      <span
                        key={dia}
                        className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium"
                      >
                        {DIA_LABEL_CURTO[dia]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(rotina)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(rotina.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {confirmDelete === rotina.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-600">Confirmar exclusão?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(rotina.id)}
                      className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
