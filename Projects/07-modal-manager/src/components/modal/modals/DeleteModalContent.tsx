import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteItem } from '@/api/modalApi'
import { Button } from '@/components/ui/Button'
import { ModalBody } from '@/components/modal/ModalBody'
import { ModalFooter } from '@/components/modal/ModalFooter'
import { ModalHeader } from '@/components/modal/ModalHeader'
import type { ModalStackEntry } from '@/lib/types/modal'

interface SharedModalProps {
  entry: ModalStackEntry
  titleId: string
  descriptionId: string
  onClose: () => void
}

export function DeleteModalContent({ entry, titleId, descriptionId, onClose }: SharedModalProps) {
  const [loading, setLoading] = useState(false)
  const itemName = entry.payload?.itemName ?? 'this item'

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteItem(itemName)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModalHeader title={entry.title} titleId={titleId} onClose={onClose} />
      <ModalBody descriptionId={descriptionId}>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <p>
              Delete <strong className="text-slate-800">{itemName}</strong>? This action cannot be
              undone.
            </p>
            <p className="mt-2 text-xs text-slate-400">Press Esc to cancel — only the top modal closes.</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" data-autofocus loading={loading} onClick={handleDelete}>
          Delete
        </Button>
      </ModalFooter>
    </>
  )
}
