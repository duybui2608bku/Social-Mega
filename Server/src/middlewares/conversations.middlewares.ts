import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import databaseService from 'services/database.services'
import { ConversationMessages } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const checkAddMember = validate(
  checkSchema(
    {
      members: {
        isArray: {
          errorMessage: ConversationMessages.MEMBERS_MUST_BE_ARRAY_OF_USER_ID
        },
        custom: {
          options: async (value) => {
            if (value.length === 0) {
              throw new Error(ConversationMessages.MEMBERS_MUST_BE_EMPTY_STRING)
            }
            const objectIds = value.map((member: string) => new ObjectId(member))

            const [members, isExistMembers] = await Promise.all([
              databaseService.users.find({ _id: { $in: objectIds } }).toArray(),
              databaseService.conversationGroups.find({ members: { $in: objectIds } }).toArray()
            ])

            if (members.length === 0) {
              throw new Error(ConversationMessages.MEMBERS_NOT_FOUND)
            }

            if (isExistMembers.length > 0) {
              throw new Error(ConversationMessages.MEMBERS_ALREADY_IN_GROUP)
            }

            return true
          }
        }
      },
      group_id: {
        isString: {
          errorMessage: ConversationMessages.GROUP_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const group = await databaseService.conversationGroups.findOne({
              _id: new ObjectId(value)
            })
            if (!group) {
              throw new Error(ConversationMessages.GROUP_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const checkdeleteMember = validate(
  checkSchema(
    {
      members: {
        isArray: {
          errorMessage: ConversationMessages.MEMBERS_MUST_BE_ARRAY_OF_USER_ID
        },
        custom: {
          options: async (value) => {
            if (value.length === 0) {
              throw new Error(ConversationMessages.MEMBERS_MUST_BE_EMPTY_STRING)
            }
            const objectIds = value.map((member: string) => new ObjectId(member))

            const [members, isExistMembers] = await Promise.all([
              databaseService.users.find({ _id: { $in: objectIds } }).toArray(),
              databaseService.conversationGroups.find({ members: { $in: objectIds } }).toArray()
            ])

            if (members.length === 0) {
              throw new Error(ConversationMessages.MEMBERS_NOT_FOUND)
            }

            if (isExistMembers.length === 0) {
              throw new Error(ConversationMessages.MEMBERS_NOT_EXIST_IN_GROUP)
            }

            return true
          }
        }
      },
      group_id: {
        isString: {
          errorMessage: ConversationMessages.GROUP_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value, { req }) => {
            const [group, isAdminGroup] = await Promise.all([
              databaseService.conversationGroups.findOne({
                _id: new ObjectId(value)
              }),
              databaseService.conversationGroups.findOne({
                _id: new ObjectId(value),
                admin: new ObjectId(req.decode_authorization.user_id)
              })
            ])
            if (!group) {
              throw new Error(ConversationMessages.GROUP_NOT_FOUND)
            }
            if (!isAdminGroup) {
              throw new Error(ConversationMessages.YOU_NOT_ADMIN_GROUP)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const createGroupConversationValidator = validate(
  checkSchema(
    {
      name: {
        isEmpty: {
          negated: true,
          errorMessage: ConversationMessages.NAME_IS_NOT_EMPTY
        },
        isString: {
          errorMessage: ConversationMessages.Name_MUST_BE_STRING
        }
      },
      members: {
        isArray: {
          errorMessage: ConversationMessages.MEMBERS_MUST_BE_ARRAY_STRING_OF_USER_ID
        },
        custom: {
          options: async (value) => {
            if (value.length < 3) {
              throw new Error(ConversationMessages.MEMBERS_MUST_BE_LARGE_THAN_THREE)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const leaveGroupConversationValidator = validate(
  checkSchema(
    {
      group_id: {
        isString: {
          errorMessage: ConversationMessages.GROUP_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value, { req }) => {
            const isExistMemberOfGroup = await databaseService.conversationGroups.findOne({
              _id: new ObjectId(value as string),
              members: new ObjectId(req.decode_authorization.user_id as string)
            })
            if (!isExistMemberOfGroup) {
              throw new Error(ConversationMessages.MEMBERS_NOT_EXIST_IN_GROUP)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const deleteGroupConversationValidator = validate(
  checkSchema(
    {
      group_id: {
        isString: {
          errorMessage: ConversationMessages.GROUP_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value, { req }) => {
            const [group, isAdminGroup] = await Promise.all([
              databaseService.conversationGroups.findOne({
                _id: new ObjectId(value as string)
              }),
              databaseService.conversationGroups.findOne({
                _id: new ObjectId(value as string),
                admin: new ObjectId(req.decode_authorization.user_id as string)
              })
            ])
            if (!group) {
              throw new Error(ConversationMessages.GROUP_NOT_FOUND)
            }
            if (!isAdminGroup) {
              throw new Error(ConversationMessages.YOU_NOT_ADMIN_GROUP)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
