import { SuccessResponse } from './Ulti.type'

export interface Media {
  name: string
  url: string
  type: number
}

export type ImageResponseType = SuccessResponse<[{ url: string; type: number }]>
export type VideoResponseType = SuccessResponse<[{ url: string; type: number }]>
export type DocumentResponseType = SuccessResponse<[{ url: string; type: number }]>
