export type SortableColumn =
  | 'name'
  | 'email'
  | 'department'
  | 'role'
  | 'status'
  | 'location'
  | 'salary'
  | 'joinDate'

export type SortOrder = 'asc' | 'desc'
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave'

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: EmployeeStatus
  location: string
  salary: number
  joinDate: string
  performanceScore: number
}

export interface TableFilters {
  department: string
  role: string
  status: string
  location: string
}

export interface TableQuery {
  search: string
  sortBy: SortableColumn
  sortOrder: SortOrder
  filters: TableFilters
  page: number
  pageSize: number
}

export interface TableMeta {
  schemaVersion: string
  collection: string
  count: number
  departments: string[]
  roles: string[]
  statuses: string[]
  locations: string[]
  generatedAt: string
}

export interface TableResultMeta {
  total: number
  filteredTotal: number
  page: number
  pageSize: number
  totalPages: number
  sortBy: SortableColumn
  sortOrder: SortOrder
}

export interface TableQueryResponse {
  meta: TableResultMeta
  data: EmployeeRecord[]
}

export type TableStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface TableState {
  rows: EmployeeRecord[]
  resultMeta: TableResultMeta | null
  datasetMeta: TableMeta | null
  query: TableQuery
  status: TableStatus
  error: string | null
}

export interface ColumnDef {
  id: SortableColumn
  label: string
  align?: 'left' | 'right'
}

export const DEFAULT_QUERY: TableQuery = {
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filters: {
    department: '',
    role: '',
    status: '',
    location: '',
  },
  page: 1,
  pageSize: 10,
}

export const TABLE_COLUMNS: ColumnDef[] = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'department', label: 'Department' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'location', label: 'Location' },
  { id: 'salary', label: 'Salary', align: 'right' },
  { id: 'joinDate', label: 'Joined', align: 'right' },
]
