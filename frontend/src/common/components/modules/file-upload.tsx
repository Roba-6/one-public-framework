import React, { useState } from 'react'

import { Input } from '@/common/components/ui/input'
import { Progress } from '@/common/components/ui/progress'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { postApi } from '@/lib/http'

const FileUpload = () => {
  const [progress, setProgress] = useState(0)
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    try {
      const response = await postApi<CommonResponse>(
        CONSTANT.API_URL.ATTACHMENT_ADMIN_UPLOAD,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? 1
            const percent = Math.round((progressEvent.loaded * 100) / total)
            setProgress(percent)
          },
        }
      )

      console.debug(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Input type="file" multiple={true} onChange={handleChange} />
      <Progress value={progress} className="w-full" />
      <div>
        <div>Upload Progress: {progress}%</div>
      </div>
    </div>
  )
}

export default FileUpload
