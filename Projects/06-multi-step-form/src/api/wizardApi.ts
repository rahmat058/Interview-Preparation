import type { WizardFormValues } from '@/lib/validation/wizardSchemas'
import type { SubmitWizardResponse } from '@/lib/types/wizard'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'
const SIMULATE_ERROR = import.meta.env.VITE_SIMULATE_FORM_ERROR === 'true'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

async function mockSubmitWizard(
  data: WizardFormValues,
  signal?: AbortSignal,
): Promise<SubmitWizardResponse> {
  await delay(800 + Math.floor(Math.random() * 600), signal)
  if (SIMULATE_ERROR) {
    throw new Error('Simulated server error — submission failed')
  }
  return {
    id: `sub_${Date.now().toString(36)}`,
    message: `Welcome aboard, ${data.firstName}! Your ${data.plan} plan is being set up.`,
    submittedAt: new Date().toISOString(),
  }
}

async function realSubmitWizard(
  data: WizardFormValues,
  signal?: AbortSignal,
): Promise<SubmitWizardResponse> {
  const response = await fetch(`${API_BASE}/wizard/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal,
  })
  if (!response.ok) {
    throw new Error(`Submission failed (${response.status})`)
  }
  return response.json() as Promise<SubmitWizardResponse>
}

export async function submitWizardForm(
  data: WizardFormValues,
  signal?: AbortSignal,
): Promise<SubmitWizardResponse> {
  return USE_MOCK ? mockSubmitWizard(data, signal) : realSubmitWizard(data, signal)
}
