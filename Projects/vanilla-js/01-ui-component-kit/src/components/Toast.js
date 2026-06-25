class ToastHost extends HTMLElement {
  connectedCallback() {
    if (!this.classList.contains('ui-toast-host')) {
      this.classList.add('ui-toast-host')
    }
  }

  /**
   * @param {Object} options
   * @param {string} options.message
   * @param {'success' | 'error' | 'info'} [options.variant]
   * @param {number} [options.duration]
   */
  show({ message, variant = 'info', duration = 4000 }) {
    const toast = document.createElement('div')
    toast.className = `ui-toast ui-toast--${variant}`
    toast.setAttribute('role', 'status')
    toast.setAttribute('aria-live', 'polite')

    const text = document.createElement('span')
    text.className = 'ui-toast__message'
    text.textContent = message

    const close = document.createElement('button')
    close.type = 'button'
    close.className = 'ui-toast__close'
    close.setAttribute('aria-label', 'Dismiss notification')
    close.textContent = '×'

    const remove = () => {
      toast.remove()
    }

    close.addEventListener('click', remove)
    toast.append(text, close)
    this.appendChild(toast)

    if (duration > 0) {
      window.setTimeout(remove, duration)
    }
  }
}

if (!customElements.get('ui-toast-host')) {
  customElements.define('ui-toast-host', ToastHost)
}

/**
 * @returns {ToastHost}
 */
export function getToastHost() {
  let host = document.querySelector('ui-toast-host')
  if (!host) {
    host = document.createElement('ui-toast-host')
    document.body.appendChild(host)
  }
  return host
}

/**
 * @param {string} message
 * @param {'success' | 'error' | 'info'} [variant]
 */
export function showToast(message, variant = 'info') {
  getToastHost().show({ message, variant })
}
