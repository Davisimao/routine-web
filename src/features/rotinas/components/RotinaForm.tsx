import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { DIAS } from '../constants'
import type { DiaSemana, RotinaInput } from '../types'

interface RotinaFormProps {
  initial?: RotinaInput
  onSave: (form: RotinaInput) => void
  onCancel: () => void
}

const EMPTY: RotinaInput = { emoji: '', titulo: '', descricao: '', dias: [] }

export default function RotinaForm({ initial, onSave, onCancel }: RotinaFormProps) {
  const [form, setForm] = useState<RotinaInput>(initial ?? EMPTY)

  useEffect(() => {
    setForm(initial ?? EMPTY)
  }, [initial])

  function toggleDia(dia: DiaSemana) {
    setForm((f) => ({
      ...f,
      dias: f.dias.includes(dia) ? f.dias.filter((d) => d !== dia) : [...f.dias, dia],
    }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.titulo.trim()) return
    if (form.dias.length === 0) return
    onSave(form)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">
          {initial ? 'Editar rotina' : 'Nova rotina'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
          <input
            type="text"
            value={form.emoji ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
            placeholder="Ex: 🏋️"
            maxLength={4}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Emoji da rotina"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            placeholder="Ex: Meditação matinal"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            placeholder="Detalhes opcionais..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias da semana <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {DIAS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleDia(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.dias.includes(key)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {form.dias.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Selecione ao menos um dia</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {initial ? 'Salvar alterações' : 'Criar rotina'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
