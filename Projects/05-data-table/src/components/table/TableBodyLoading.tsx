import { TABLE_COLUMNS } from '@/lib/types/table'

interface TableBodyLoadingProps {
  rowCount?: number
}

export function TableBodyLoading({ rowCount = 5 }: TableBodyLoadingProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {TABLE_COLUMNS.map((col) => (
            <td key={col.id} className="px-4 py-3">
              <div className="h-4 rounded bg-blue-100/60" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
