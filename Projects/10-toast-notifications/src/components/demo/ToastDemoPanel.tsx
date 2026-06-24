import { Bell, Layers, Timer, Zap } from 'lucide-react'
import { useAppDispatch } from '@/lib/store/hooks'
import { dismissAll } from '@/lib/store/slices/toastSlice'
import { useToast } from '@/hooks/useToast'
import { MAX_VISIBLE_TOASTS } from '@/lib/types/toast'
import { Button } from '@/components/ui/Button'

export function ToastDemoPanel() {
  const toast = useToast()
  const dispatch = useAppDispatch()

  function spamQueue() {
    const messages = [
      { type: 'success' as const, title: 'Profile saved' },
      { type: 'info' as const, title: 'Syncing preferences…' },
      { type: 'warning' as const, title: 'Storage almost full' },
      { type: 'error' as const, title: 'Upload failed' },
      { type: 'success' as const, title: 'Invite sent' },
      { type: 'info' as const, title: 'New comment on your post' },
    ]

    messages.forEach((item, index) => {
      window.setTimeout(() => {
        toast.custom({
          type: item.type,
          title: item.title,
          message: `Queued toast #${index + 1} — max ${MAX_VISIBLE_TOASTS} visible`,
        })
      }, index * 200)
    })
  }

  return (
    <div className="glass-card p-5 sm:p-8">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-800">Trigger notifications</h3>
        <p className="mt-1 text-xs text-slate-500">
          Hover a toast to pause its timer. Spam queue to see promote-from-pending behavior.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="success" onClick={() => toast.success('Changes saved successfully')}>
          Success
        </Button>
        <Button variant="danger" onClick={() => toast.error({ title: 'Payment failed', message: 'Card declined — try another method.' })}>
          Error
        </Button>
        <Button variant="warning" onClick={() => toast.warning('Session expires in 5 minutes')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info({ title: 'Tip', message: 'Hover any toast to pause auto-dismiss.' })}>
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.custom({
              type: 'info',
              title: 'Persistent alert',
              message: 'No auto-dismiss — close manually.',
              duration: 0,
            })
          }
        >
          Persistent
        </Button>
        <Button variant="primary" onClick={spamQueue}>
          <Zap className="h-4 w-4" />
          Spam queue (6)
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-indigo-100/80 pt-4">
        <Button variant="ghost" size="sm" onClick={() => dispatch(dismissAll())}>
          Dismiss all
        </Button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          { icon: Layers, text: `Max ${MAX_VISIBLE_TOASTS} visible` },
          { icon: Timer, text: 'Pause on hover' },
          { icon: Bell, text: 'Portal viewport' },
        ].map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50/80 px-2.5 py-2 text-[11px] text-indigo-700"
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
