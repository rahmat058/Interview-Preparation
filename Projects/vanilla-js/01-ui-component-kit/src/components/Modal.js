const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE))
}

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} [options.confirmLabel]
 * @param {string} [options.cancelLabel]
 * @returns {Promise<boolean>}
 */
export function openModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog')
    dialog.className = 'ui-modal'
    dialog.setAttribute('aria-labelledby', 'ui-modal-title')
    dialog.innerHTML = `
      <div class="ui-modal__panel">
        <h2 id="ui-modal-title" class="ui-modal__title"></h2>
        <p class="ui-modal__body"></p>
        <div class="ui-modal__actions">
          <button type="button" class="ui-btn ui-btn--secondary" data-action="cancel"></button>
          <button type="button" class="ui-btn ui-btn--primary" data-action="confirm"></button>
        </div>
      </div>
    `

    dialog.querySelector('.ui-modal__title').textContent = title
    dialog.querySelector('.ui-modal__body').textContent = message
    dialog.querySelector('[data-action="cancel"]').textContent = cancelLabel
    dialog.querySelector('[data-action="confirm"]').textContent = confirmLabel

    const previouslyFocused = document.activeElement

    const close = (result) => {
      dialog.close()
      dialog.remove()
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
      resolve(result)
    }

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault()
      close(false)
    })

    dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => close(false))
    dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => close(true))

    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return
      const focusable = getFocusable(dialog)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    })

    document.body.appendChild(dialog)
    dialog.showModal()
    dialog.querySelector('[data-action="confirm"]').focus()
  })
}
