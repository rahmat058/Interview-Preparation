import { HelpCircle } from 'lucide-react'
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

export function ConfirmModalContent({ entry, titleId, descriptionId, onClose }: SharedModalProps) {
  return (
    <>
      <ModalHeader title={entry.title} titleId={titleId} onClose={onClose} />
      <ModalBody descriptionId={descriptionId}>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <p>{entry.payload?.message ?? 'Are you sure you want to continue?'}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button data-autofocus onClick={onClose}>
          Confirm
        </Button>
      </ModalFooter>
    </>
  )
}
