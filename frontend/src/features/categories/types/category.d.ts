interface CategoryBase {
  name: string
  value?: string
  alias?: string
  description?: string
  parent?: CategoryBase
  categoryId?: string
  options?: string
}

export interface Category extends CategoryBase {
  id?: string
  isEnabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateCategoryRequest = CategoryBase & {
  isEnabled?: boolean
}

export type UpdateCategoryRequest = CreateCategoryRequest
