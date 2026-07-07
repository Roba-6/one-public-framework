interface CategoryBase {
  name: string
  value?: string
  alias?: string
  description?: string
  categoryId?: string | null
  options?: string
}

export interface Category extends CategoryBase {
  id?: string
  isEnabled?: boolean
  createdAt?: string
  updatedAt?: string
  parent?: Category
  categoryId?: string | null
}

export type CreateCategoryRequest = CategoryBase & {
  isEnabled?: boolean
  categoryId?: string | null
}

export type UpdateCategoryRequest = CreateCategoryRequest
