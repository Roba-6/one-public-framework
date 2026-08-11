'use client'

import { useParams } from 'next/navigation'

import DetailFeaturesScreen from '@/src/features/admin/features/detail-screen'

const FeaturePage = () => {
  const { id } = useParams<{ id: string }>()

  return <DetailFeaturesScreen id={id} />
}

export default FeaturePage
