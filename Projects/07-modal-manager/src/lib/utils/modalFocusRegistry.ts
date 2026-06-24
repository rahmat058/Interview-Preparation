const triggerElements = new Map<string, HTMLElement>()

export function registerModalTrigger(modalId: string, element: HTMLElement) {
  triggerElements.set(modalId, element)
}

export function getModalTrigger(modalId: string): HTMLElement | undefined {
  return triggerElements.get(modalId)
}

export function unregisterModalTrigger(modalId: string) {
  triggerElements.delete(modalId)
}

export function restoreModalFocus(modalId: string) {
  const trigger = triggerElements.get(modalId)
  unregisterModalTrigger(modalId)
  if (trigger && document.contains(trigger)) {
    requestAnimationFrame(() => trigger.focus())
  }
}
