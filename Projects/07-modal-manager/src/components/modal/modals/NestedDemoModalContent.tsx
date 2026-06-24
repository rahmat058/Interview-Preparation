import { Layers } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { Button } from '@/components/ui/Button'
import { ModalBody } from '@/components/modal/ModalBody'
import { ModalFooter } from '@/components/modal/ModalFooter'
import { ModalHeader } from '@/components/modal/ModalHeader'
import type { ModalStackEntry } from '@/lib/types/modal'

interface SharedModalProps {
  entry: ModalStackEntry
  titleId: string
  descriptionId: string
  depth: number
  stackSize: number
  onClose: () => void
}

const MAX_NESTED_DEPTH = 3

export function NestedDemoModalContent({
  entry,
  titleId,
  descriptionId,
  depth,
  stackSize,
  onClose,
}: SharedModalProps) {
  const { open } = useModal()
  const currentDepth = entry.payload?.depth ?? depth + 1
  const canNest = currentDepth < MAX_NESTED_DEPTH

  function handleOpenNested(event: React.MouseEvent<HTMLButtonElement>) {
    const nextDepth = currentDepth + 1
    open({
      type: 'nested-demo',
      title: `Nested layer ${nextDepth}`,
      payload: { depth: nextDepth, maxDepth: MAX_NESTED_DEPTH },
      trigger: event.currentTarget,
    })
  }

  return (
    <>
      <ModalHeader title={entry.title} titleId={titleId} onClose={onClose} />
      <ModalBody descriptionId={descriptionId}>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Layers className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <p>
              You are on layer <strong className="text-slate-800">{currentDepth}</strong> of{' '}
              {MAX_NESTED_DEPTH}. Stack size: <strong className="text-slate-800">{stackSize}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>{' '}
              to peel one layer at a time. Focus stays trapped in the topmost dialog.
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close layer
        </Button>
        {canNest ? (
          <Button data-autofocus onClick={handleOpenNested}>
            Open nested modal
          </Button>
        ) : (
          <Button data-autofocus onClick={onClose}>
            Close all (top layer)
          </Button>
        )}
      </ModalFooter>
    </>
  )
}
