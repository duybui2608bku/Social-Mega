import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'
import { ConversationMessages } from '~/constants/messages'
class ConversationsService {
  async getConversation({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const conversation = await databaseService.conversations
      .find(match)
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await databaseService.conversations.countDocuments(match)
    return {
      conversation,
      total
    }
  }

  async createGroupConversation({ name, members, user_id }: { name: string; members: string[]; user_id: string }) {
    const conversation = {
      name,
      admin: new ObjectId(user_id),
      members: members.map((member) => new ObjectId(member)),
      created_at: new Date(),
      updated_at: new Date()
    }
    const result = await databaseService.conversationGroups.insertOne(conversation)
    await databaseService.users.updateMany(
      { _id: { $in: members.map((member) => new ObjectId(member)) } },
      { $push: { group_conversations: result.insertedId } }
    )

    return result
  }

  async addMembersToGroupConversation({ members, group_id }: { members: string[]; group_id: string }) {
    const result = await Promise.all([
      await databaseService.conversationGroups.updateOne(
        { _id: new ObjectId(group_id) },
        { $push: { members: { $each: members.map((member) => new ObjectId(member)) } } }
      ),
      databaseService.users.updateMany(
        { _id: { $in: members.map((member) => new ObjectId(member)) } },
        { $push: { group_conversations: new ObjectId(group_id) } }
      )
    ])
    console.log(result)
  }

  async deleteMembersFromGroupConversation({ members, group_id }: { members: string[]; group_id: string }) {
    const objectIds = members.map((member) => new ObjectId(member))
    await Promise.all([
      databaseService.conversationGroups.updateOne(
        { _id: new ObjectId(group_id) },
        { $pull: { members: { $in: objectIds } } as any }
      ),
      databaseService.users.updateMany(
        { _id: { $in: objectIds } },
        { $pull: { group_conversations: new ObjectId(group_id) } }
      )
    ])
  }

  async leaveGroupConversation({ group_id, user_id }: { group_id: string; user_id: string }) {
    await Promise.all([
      databaseService.conversationGroups.updateOne(
        { _id: new ObjectId(group_id) },
        { $pull: { members: new ObjectId(user_id) } }
      ),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        { $pull: { group_conversations: new ObjectId(group_id) } }
      )
    ])
  }

  async deleteGroupConversation({ group_id }: { group_id: string }) {
    await Promise.all([
      databaseService.conversationGroups.deleteOne({ _id: new ObjectId(group_id) }),
      databaseService.users.updateMany({}, { $pull: { group_conversations: new ObjectId(group_id) } })
    ])
  }
}

const conversationService = new ConversationsService()
export default conversationService
