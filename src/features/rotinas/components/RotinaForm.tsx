import { useEffect, useState, type FormEvent } from 'react'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { Smile, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DIAS } from '../constants'
import type { DiaSemana, RotinaInput } from '../types'

interface RotinaFormProps {
  initial?: RotinaInput
  embedded?: boolean
  onSave: (form: RotinaInput) => void
  onCancel: () => void
}

const EMPTY: RotinaInput = { emoji: '', titulo: '', descricao: '', dias: [] }

export default function RotinaForm({ initial, embedded = false, onSave, onCancel }: RotinaFormProps) {
  const [form, setForm] = useState<RotinaInput>(initial ?? EMPTY)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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
    <div className={embedded ? '' : 'mb-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm'}>
      {!embedded && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-foreground">
            {initial ? 'Editar rotina' : 'Nova rotina'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground transition-colors hover:text-foreground">
            <X size={18} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Emoji</label>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((visible) => !visible)}
              className="flex h-12 w-14 items-center justify-center rounded-md border border-input bg-background text-2xl hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Escolher emoji"
              aria-expanded={showEmojiPicker}
            >
              {form.emoji || <Smile size={22} className="text-muted-foreground" />}
            </button>

            {showEmojiPicker && (
              <div className="absolute left-0 top-full z-10 mt-2">
                <EmojiPicker
                  onEmojiClick={(emojiData: EmojiClickData) => {
                    setForm((current) => ({ ...current, emoji: emojiData.emoji }))
                    setShowEmojiPicker(false)
                  }}
                  lazyLoadEmojis
                  searchPlaceholder="Buscar emoji"
                  width={320}
                />
                {form.emoji && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((current) => ({ ...current, emoji: '' }))
                      setShowEmojiPicker(false)
                    }}
                    className="mt-2 w-full border-t border-border pt-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Remover emoji
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            placeholder="Ex: Meditação matinal"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            placeholder="Detalhes opcionais..."
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
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
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-muted-foreground hover:border-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {form.dias.length === 0 && (
            <p className="mt-1 text-xs text-destructive">Selecione ao menos um dia</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            type="submit"
            className="flex-1"
          >
            {initial ? 'Salvar alterações' : 'Criar rotina'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
