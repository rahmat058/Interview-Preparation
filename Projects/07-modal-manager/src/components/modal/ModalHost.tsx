import { useAppSelector } from '@/lib/store/hooks'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useGlobalEscapeKey } from '@/hooks/useEscapeKey'
import { ModalLayer } from '@/components/modal/ModalLayer'

export function ModalHost() {
  const stack = useAppSelector((state) => state.modal.stack)

  useBodyScrollLock(stack.length > 0)
  useGlobalEscapeKey()

  if (stack.length === 0) return null

  return (
    <>
      {stack.map((entry, index) => (
        <ModalLayer
          key={entry.id}
          entry={entry}
          depth={index}
          isTop={index === stack.length - 1}
          stackSize={stack.length}
        />
      ))}
    </>
  )
}
