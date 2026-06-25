import './components/Toast.js'
import { createButton } from './components/Button.js'
import { openModal } from './components/Modal.js'
import { showToast } from './components/Toast.js'

const app = document.getElementById('app')

app.innerHTML = `
  <div class="demo-page">
    <header class="demo-header">
      <h1>UI Component Kit</h1>
      <p>Vanilla JS primitives — tokens, factory components, Web Components, a11y.</p>
    </header>
    <section class="demo-section" aria-labelledby="buttons-heading">
      <h2 id="buttons-heading">Buttons</h2>
      <div class="demo-row" id="button-row"></div>
    </section>
    <section class="demo-section" aria-labelledby="overlay-heading">
      <h2 id="overlay-heading">Modal & Toast</h2>
      <div class="demo-row" id="overlay-row"></div>
    </section>
  </div>
`

document.getElementById('button-row').append(
  createButton({ label: 'Primary', variant: 'primary' }),
  createButton({ label: 'Secondary', variant: 'secondary' }),
  createButton({ label: 'Disabled', variant: 'primary', disabled: true }),
)

document.getElementById('overlay-row').append(
  createButton({
    label: 'Open modal',
    variant: 'primary',
    onClick: async () => {
      const confirmed = await openModal({
        title: 'Delete item?',
        message: 'This action cannot be undone. Focus is trapped until you confirm or cancel.',
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
      })
      showToast(confirmed ? 'Item deleted' : 'Cancelled', confirmed ? 'success' : 'info')
    },
  }),
  createButton({
    label: 'Show toast',
    variant: 'secondary',
    onClick: () => showToast('Saved to library', 'success'),
  }),
  createButton({
    label: 'Error toast',
    variant: 'secondary',
    onClick: () => showToast('Network request failed', 'error'),
  }),
)
