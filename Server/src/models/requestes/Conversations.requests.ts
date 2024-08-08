import { ParamsDictionary } from 'express-serve-static-core'
export interface GetConversationsRequests extends ParamsDictionary {
  receiver_id: string
}
