import employeesPayload from '@/data/employees.json'
import type { EmployeeRecord, TableMeta } from '@/lib/types/table'

interface EmployeesFile {
  meta: TableMeta
  data: EmployeeRecord[]
}

const typedPayload = employeesPayload as EmployeesFile

export function getMockEmployees(): EmployeesFile {
  return typedPayload
}
