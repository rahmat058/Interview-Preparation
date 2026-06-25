import { describe, expect, it } from 'vitest'
import { createButton, isPrimaryButton } from '../src/components/Button.js'

describe('createButton', () => {
  it('renders label and variant class', () => {
    const button = createButton({ label: 'Save', variant: 'primary' })
    expect(button.textContent).toBe('Save')
    expect(isPrimaryButton(button.className)).toBe(true)
  })

  it('respects disabled state', () => {
    const button = createButton({ label: 'Save', disabled: true })
    expect(button.disabled).toBe(true)
  })

  it('calls onClick handler', () => {
    let clicked = false
    const button = createButton({ label: 'Go', onClick: () => { clicked = true } })
    button.click()
    expect(clicked).toBe(true)
  })
})
