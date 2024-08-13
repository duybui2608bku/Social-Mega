import { SuccessResponse } from './Ulti.type'

export interface Media {
  url: string
  type: number
}

export type ImageResponseType = SuccessResponse<[{ url: string; type: number }]>
