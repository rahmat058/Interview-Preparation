import { useAppSelector } from '@/lib/store/hooks'
import { TABLE_COLUMNS } from '@/lib/types/table'
import { TableHeaderRow } from '@/components/table/TableHeaderRow'
import { TableRow } from '@/components/table/TableRow'
import { TableEmpty } from '@/components/table/TableEmpty'
import { TableBodyLoading } from '@/components/table/TableBodyLoading'

export function DataTable() {
  const { rows, status } = useAppSelector((state) => state.table)
  const isLoading = status === 'loading'

  return (
    <div className="table-scroll overflow-x-auto">
      <table className="min-w-[960px] w-full border-collapse">
        <TableHeaderRow />
        <tbody className="min-h-[12rem]">
          {isLoading ? (
            <TableBodyLoading />
          ) : rows.length === 0 ? (
            <TableEmpty colSpan={TABLE_COLUMNS.length} />
          ) : (
            rows.map((row, index) => <TableRow key={row.id} row={row} index={index} />)
          )}
        </tbody>
      </table>
    </div>
  )
}
