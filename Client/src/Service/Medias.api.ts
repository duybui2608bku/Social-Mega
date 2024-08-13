import { ImageResponseType } from 'src/Types/Medias.type'
import axiosInstance from 'src/Utils/Axios'

export const uploadImages = (body: FormData) => {
  return axiosInstance.post<ImageResponseType>('/upload/image', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const uploadVideos = (body: FormData) => {
  return axiosInstance.post<ImageResponseType>('/upload/video', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
