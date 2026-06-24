import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { submitWizardForm } from '@/api/wizardApi'
import type { WizardState } from '@/lib/types/wizard'
import { WIZARD_STEPS } from '@/lib/types/wizard'
import type { WizardFormValues } from '@/lib/validation/wizardSchemas'

const initialState: WizardState = {
  currentStep: 0,
  completedSteps: [],
  submitStatus: 'idle',
  submitError: null,
  submissionId: null,
  restoredFromStorage: false,
}

export const submitWizard = createAsyncThunk(
  'wizard/submit',
  async (data: WizardFormValues, { signal }) => {
    return submitWizardForm(data, signal)
  },
)

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      const step = Math.max(0, Math.min(action.payload, WIZARD_STEPS.length - 1))
      state.currentStep = step
    },
    markStepCompleted(state, action: PayloadAction<number>) {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload)
        state.completedSteps.sort((a, b) => a - b)
      }
    },
    goToNextStep(state) {
      if (state.currentStep < WIZARD_STEPS.length - 1) {
        state.currentStep += 1
      }
    },
    goToPreviousStep(state) {
      if (state.currentStep > 0) {
        state.currentStep -= 1
      }
    },
    restoreWizardState(
      state,
      action: PayloadAction<{ currentStep: number; completedSteps: number[] }>,
    ) {
      state.currentStep = action.payload.currentStep
      state.completedSteps = action.payload.completedSteps
      state.restoredFromStorage = true
    },
    resetWizard(state) {
      Object.assign(state, { ...initialState, restoredFromStorage: false })
    },
    clearSubmitStatus(state) {
      state.submitStatus = 'idle'
      state.submitError = null
      state.submissionId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitWizard.pending, (state) => {
        state.submitStatus = 'submitting'
        state.submitError = null
      })
      .addCase(submitWizard.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded'
        state.submissionId = action.payload.id
        state.submitError = null
      })
      .addCase(submitWizard.rejected, (state, action) => {
        if (action.error.name === 'AbortError') return
        state.submitStatus = 'failed'
        state.submitError = action.error.message ?? 'Submission failed'
      })
  },
})

export const {
  setCurrentStep,
  markStepCompleted,
  goToNextStep,
  goToPreviousStep,
  restoreWizardState,
  resetWizard,
  clearSubmitStatus,
} = wizardSlice.actions

export default wizardSlice.reducer
