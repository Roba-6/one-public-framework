interface AttachmentBase {
  name?: string
  description?: string
}

export interface Attachment extends AttachmentBase {
  id?: string
  requiresAuth?: boolean
  mimeType: string
  size: number
  url?: string
  preview?: string
}

export type CreateAttachmentRequest = AttachmentBase
export type UpdateAttachmentRequest = AttachmentBase
