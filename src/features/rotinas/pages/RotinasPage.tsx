import { useState } from 'react'
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  }

  function handleEditDialogChange(open: boolean) {
    if (!open) setEditing(null)
  }

  function handleDelete(id: string) {
    void deleteRotina(id)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rotinas</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {rotinas.length} rotina{rotinas.length !== 1 ? 's' : ''} cadastrada
            {rotinas.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!showForm && !editing && (
          <Button
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Nova rotina
          </Button>
        )}
      </div>

      {showForm && <RotinaForm onSave={handleSave} onCancel={() => setShowForm(false)} />}

      <Dialog open={Boolean(editing)} onOpenChange={handleEditDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar rotina</DialogTitle>
            <DialogDescription>
              Atualize os dados de “{editing?.titulo}”.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <RotinaForm
              embedded
              initial={{
                emoji: editing.emoji,
                titulo: editing.titulo,
                descricao: editing.descricao,
                dias: editing.dias,
              }}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {rotinas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <CalendarDays size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium text-foreground">Nenhuma rotina ainda</p>
          <p className="mt-1 text-sm">Clique em "Nova rotina" para começar.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rotinas.map((rotina) => (
            <Card key={rotina.id} className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {rotina.emoji && <span className="mr-2">{rotina.emoji}</span>}
                    {rotina.titulo}
                  </p>
                  {rotina.descricao && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{rotina.descricao}</p>
                  )}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {DIA_ORDER.filter((d) => rotina.dias.includes(d)).map((dia) => (
                      <Badge
                        key={dia}
                        className="border-transparent bg-primary/10 text-primary"
                      >
                        {DIA_LABEL_CURTO[dia]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(rotina)}
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmDelete(rotina.id)}
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>

              {confirmDelete === rotina.id && (
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Confirmar exclusão?</p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rotina.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </ul>
      )}
    </div>
  )
}
