export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null,
  )
}

export function getInitialFocusElement(container: HTMLElement): HTMLElement | null {
  const autofocus = container.querySelector<HTMLElement>('[data-autofocus]')
  if (autofocus) return autofocus

  const focusables = getFocusableElements(container)
  return focusables[0] ?? null
}
