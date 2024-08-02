import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { Bookmark } from '../src/models/schemas/Bookmark.schema'
class BookmarkService {
  bookmarkInstagrams = async (user_id: string, instagram_id: string) => {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      { user_id: new ObjectId(user_id), instagram_id: new ObjectId(instagram_id) },
      { $setOnInsert: new Bookmark({ user_id: new ObjectId(user_id), instagram_id: new ObjectId(instagram_id) }) },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }

  unBookmarkInstagrams = async (user_id: string, instagram_id: string) => {
    console.log('BookmarkService -> unBookmarkInstagrams -> user_id', user_id, instagram_id)
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      instagram_id: new ObjectId(instagram_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
