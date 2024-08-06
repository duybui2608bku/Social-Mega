import { PeopleFollow } from '~/constants/enum'
import { Pagination } from './Instagrams.requests'

export interface SearchQuery extends Pagination {
  content: string
  people_follow: PeopleFollow
}

export interface SearchQueryHashtags extends Pagination {
  hashtag: string
}

export interface SearchQueryUsers {
  name: string
}
