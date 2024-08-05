import { InstagramsAudiance, InstagramsType } from '~/constants/enum'
import { Media } from '../other'
import { ParamsDictionary, Query } from 'express-serve-static-core'
export interface InstagramsRequestBody {
  type: InstagramsType
  audiance: InstagramsAudiance
  content: string
  parent_id: string | null
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
export interface InstagramsChildrenParams extends ParamsDictionary {
  instagrams_id: string
}

export interface InstagramsChildrentQuery extends Query {
  page: string
  limit: string
  instagram_type: string
}
