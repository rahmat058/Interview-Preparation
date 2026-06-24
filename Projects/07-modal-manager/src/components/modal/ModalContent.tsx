import type { ModalStackEntry } from '@/lib/types/modal'
import { ConfirmModalContent } from '@/components/modal/modals/ConfirmModalContent'
import { DeleteModalContent } from '@/components/modal/modals/DeleteModalContent'
import { FormModalContent } from '@/components/modal/modals/FormModalContent'
import { InfoModalContent } from '@/components/modal/modals/InfoModalContent'
import { NestedDemoModalContent } from '@/components/modal/modals/NestedDemoModalContent'

interface ModalContentProps {
  entry: ModalStackEntry
  titleId: string
  descriptionId: string
  depth: number
  stackSize: number
  isTop: boolean
  onClose: () => void
}

export function ModalContent({
  entry,
  titleId,
  descriptionId,
  depth,
  stackSize,
  isTop,
  onClose,
}: ModalContentProps) {
  const shared = { entry, titleId, descriptionId, depth, stackSize, isTop, onClose }

  switch (entry.type) {
    case 'info':
      return <InfoModalContent {...shared} />
    case 'confirm':
      return <ConfirmModalContent {...shared} />
    case 'form':
      return <FormModalContent {...shared} />
    case 'delete':
      return <DeleteModalContent {...shared} />
    case 'nested-demo':
      return <NestedDemoModalContent {...shared} />
    default:
      return null
  }
}
