import { useState } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { submitReply } from '@/lib/store/slices/commentsSlice'
import { Button } from '@/components/ui/Button'

interface CommentReplyFormProps {
  parentId: string
  depth: number
}

export function CommentReplyForm({ parentId, depth }: CommentReplyFormProps) {
  const dispatch = useAppDispatch()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return

    setLoading(true)
    try {
      await dispatch(submitReply({ parentId, body: trimmed })).unwrap()
      setBody('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-2 ml-11 rounded-xl border border-orange-100 bg-white/80 p-3"
      style={{ marginLeft: `${Math.min(depth + 1, 6) * 12 + 44}px` }}
    >
      <label htmlFor={`reply-${parentId}`} className="sr-only">
        Write a reply
      </label>
      <textarea
        id={`reply-${parentId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder="What are your thoughts?"
        className="w-full resize-none rounded-lg border border-orange-200/80 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        data-autofocus
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="submit" size="sm" loading={loading} disabled={!body.trim()}>
          Post reply
        </Button>
      </div>
    </form>
  )
}
