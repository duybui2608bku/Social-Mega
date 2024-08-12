import { Media } from './Medias.type'

export interface BookmarkType {
  _id: string
  media: Media[]
  content: string
}
