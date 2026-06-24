import { SearchX } from 'lucide-react'

interface TableEmptyProps {
  colSpan: number
}

export function TableEmpty({ colSpan }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <SearchX className="mx-auto mb-3 h-10 w-10 text-blue-300" />
        <p className="text-sm font-medium text-slate-600">No employees match your query</p>
        <p className="mt-1 text-xs text-slate-400">Try adjusting search or filters</p>
      </td>
    </tr>
  )
}
