import type { EmployeeRecord } from '@/lib/types/table'
import { formatJoinDate, formatSalary } from '@/lib/utils/tableQuery'
import { StatusBadge } from '@/components/table/StatusBadge'

interface TableRowProps {
  row: EmployeeRecord
  index: number
}

export function TableRow({ row, index }: TableRowProps) {
  return (
    <tr className={index % 2 === 0 ? 'bg-white/40' : 'bg-blue-50/20'}>
      <td className="px-4 py-3 text-sm font-medium text-slate-800">{row.name}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{row.email}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{row.department}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{row.role}</td>
      <td className="px-4 py-3">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{row.location}</td>
      <td className="px-4 py-3 text-right text-sm font-medium text-slate-700 tabular-nums">
        {formatSalary(row.salary)}
      </td>
      <td className="px-4 py-3 text-right text-sm text-slate-500 tabular-nums">
        {formatJoinDate(row.joinDate)}
      </td>
    </tr>
  )
}
