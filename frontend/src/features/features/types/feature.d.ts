interface FeatureBase {
  name: string
}

export interface Feature extends FeatureBase {
  id?: string
  isEnabled?: boolean
  requiresAuth?: boolean
}

export type CreateFeatureRequest = FeatureBase
export type UpdateFeatureRequest = FeatureBase
