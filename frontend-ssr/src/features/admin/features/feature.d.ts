interface FeatureBase {
  key: string
  name?: string
}

export interface Feature extends FeatureBase {
  id?: string
  isEnabled?: boolean
  requiresAuth?: boolean
}

export type CreateFeatureRequest = FeatureBase
export type UpdateFeatureRequest = FeatureBase
