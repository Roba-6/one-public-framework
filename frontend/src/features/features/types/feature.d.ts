interface FeatureBase {
  name: string
}

export interface Feature extends FeatureBase {
  id?: string
}

export type CreateFeatureRequest = FeatureBase
export type UpdateFeatureRequest = FeatureBase
