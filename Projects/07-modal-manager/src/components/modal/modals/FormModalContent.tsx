import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { saveProfile } from '@/api/modalApi'
import { Button } from '@/components/ui/Button'
import { ModalBody } from '@/components/modal/ModalBody'
import { ModalFooter } from '@/components/modal/ModalFooter'
import { ModalHeader } from '@/components/modal/ModalHeader'
import type { ModalStackEntry } from '@/lib/types/modal'

interface SharedModalProps {
  entry: ModalStackEntry
  titleId: string
  descriptionId: string
  onClose: () => void
}

export function FormModalContent({ entry, titleId, descriptionId, onClose }: SharedModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await saveProfile({ name: name.trim(), email: email.trim() })
      onClose()
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader title={entry.title} titleId={titleId} onClose={onClose} />
      <ModalBody descriptionId={descriptionId}>
        <div className="mb-4 flex items-center gap-2 text-violet-700">
          <UserRound className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Focus trap demo</span>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Full name</span>
            <input
              data-autofocus
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-violet-200/80 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              placeholder="Alex Rivera"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-violet-200/80 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              placeholder="alex@example.com"
            />
          </label>
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
              {error}
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save profile
        </Button>
      </ModalFooter>
    </form>
  )
}
