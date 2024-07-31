import { InstagramsAudiance, InstagramsType } from '~/constants/enum'
import { Media } from '../other'

export interface InstagramsRequestBody {
  type: InstagramsType
  audiance: InstagramsAudiance
  content: string
  parent_id: string | null
  hashtags: string[]
  mentions: string[]
  media: Media
}
