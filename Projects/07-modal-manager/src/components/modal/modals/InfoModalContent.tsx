import { Info } from 'lucide-react'
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

export function InfoModalContent({ entry, titleId, descriptionId, onClose }: SharedModalProps) {
  return (
    <>
      <ModalHeader title={entry.title} titleId={titleId} onClose={onClose} />
      <ModalBody descriptionId={descriptionId}>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Info className="h-5 w-5" />
          </div>
          <p>{entry.payload?.message ?? 'This is a simple informational modal.'}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button data-autofocus onClick={onClose}>
          Got it
        </Button>
      </ModalFooter>
    </>
  )
}
