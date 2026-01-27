import type { Action, DataColumn } from '@/common/types/data'

interface DataListProps<T> {
  columns: DataColumn<T>[]
  data: T[]
  selectable?: boolean
  actions?: Action[]
}

interface EditFormProps<T> {
  id?: string
  items: any[]
  data?: T
  loadingData?: boolean
  submitForm: any
}

interface DataDetailProps<T> {
  columns: DataColumn<T>[]
  data: T
  loadingData?: boolean
}
