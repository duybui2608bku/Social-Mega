import { Pagination } from './Instagrams.requests'

export interface SearchQuery extends Pagination {
  content: string
}

export interface SearchQueryHashtags extends Pagination {
  hashtag: string
}
