import { DocumentResponseType, ImageResponseType, VideoResponseType } from 'src/Types/Medias.type'
import axiosInstance from 'src/Utils/Axios'

export const uploadImages = (body: FormData) => {
  return axiosInstance.post<ImageResponseType>('/upload/image', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const uploadVideos = (body: FormData) => {
  return axiosInstance.post<VideoResponseType>('/upload/video', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const uploadDocuments = (body: FormData) => {
  return axiosInstance.post<DocumentResponseType>('/upload/document', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
