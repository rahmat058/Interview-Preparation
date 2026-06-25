/**
 * @param {Object} options
 * @param {string} options.label
 * @param {'primary' | 'secondary'} [options.variant]
 * @param {boolean} [options.disabled]
 * @param {() => void} [options.onClick]
 * @returns {HTMLButtonElement}
 */
export function createButton({ label, variant = 'primary', disabled = false, onClick }) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `ui-btn ui-btn--${variant}`
  button.textContent = label
  button.disabled = disabled
  if (onClick) button.addEventListener('click', onClick)
  return button
}

/**
 * @param {string} className
 * @returns {boolean}
 */
export function isPrimaryButton(className) {
  return className.includes('ui-btn--primary')
}
