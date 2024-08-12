import './Chat.scss'
import { LuPhone } from 'react-icons/lu'
import { CiVideoOn } from 'react-icons/ci'
import { IoInformationCircleOutline, IoImageOutline } from 'react-icons/io5'
import { FiSmile } from 'react-icons/fi'
import { AiTwotoneAudio } from 'react-icons/ai'
import { FaRegHeart, FaXmark } from 'react-icons/fa6'
import { useContext, useEffect, useRef, useState } from 'react'
import socket from 'src/Utils/socketIO'
import { AppContext } from 'src/Context/App.context'
import { getConversation } from 'src/Service/Conversations'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery } from '@tanstack/react-query'
import { getHourAndMinute } from 'src/Utils/Other'
import { PiArrowBendUpLeftLight } from 'react-icons/pi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { toast } from 'react-toastify'
import config from '../../constants/config'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getAccessTokenFormLS } from 'src/Utils/Auth'
import { UserApi } from 'src/Service/User.api'
import { GroupConversationType, PrivateConversation } from 'src/Types/Conversations.type'
import { UserProfileAggregationsType } from 'src/Types/User.type'
import { RxPencil2 } from 'react-icons/rx'
import { Avatar, AvatarGroup } from '@chakra-ui/react'
const Chat = () => {
  const LIMIT = 15
  const LIMIT_FECTH_MORE = 3
  const PAGE = 1
  interface Message {
    _id: string
    sender_id: string | undefined
    receiver_id: string | undefined
    content: string | undefined
    created_at?: Date | string
    updated_at?: Date | string
  }

  const { profile } = useContext(AppContext)
  const [messagesSendOne, setMessagesSendOne] = useState('')
  const [IdUser, setIdUser] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [message, setMessage] = useState<Message[]>([])
  const [pagination, setPagination] = useState({ page: PAGE, total_page: 0 })
  const [pickerVisible, setPickerVisible] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const [inforConversations, setInforConversations] = useState<PrivateConversation>([])
  const [inforConversationsGroup, setInforConversationsGroup] = useState<GroupConversationType[]>([])
  const [isPrivateConversation, setIsPrivateConversation] = useState(true)
  const [userDetail, setUserDetail] = useState<UserProfileAggregationsType>({ _id: '', name: '', avatar: '' })
  const [groupDetail, setGroupDetail] = useState<GroupConversationType>({
    _id: '',
    name: '',
    admin: '',
    members: [
      {
        _id: '',
        name: '',
        avatar: ''
      }
    ]
  })

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const token = getAccessTokenFormLS()
    if (token && profile?._id) {
      const timer = setTimeout(() => {
        socket.auth = { Authoriration: token }
        socket.connect()
        socket.on('receive private message', (data) => {
          const { payload } = data
          setMessage((conversation) => [...conversation, payload])
        })

        socket.on('connect_error', (error) => {
          console.log('Socket connection error:', error)
        })
      }, 1000)
      return () => {
        clearTimeout(timer)
        socket.disconnect()
      }
    }
  }, [profile?._id])

  const { data: conversations, refetch } = useQuery({
    queryKey: ['conversation'],
    queryFn: () => {
      if (IdUser) {
        return getConversation({ receiver_id: IdUser, limit: LIMIT, page: PAGE })
      }
      return Promise.resolve(null)
    },
    enabled: !!IdUser
  })

  const { data: InforConversation } = useQuery({
    queryKey: ['infor-conversation'],
    queryFn: () => {
      return UserApi.GetInforConversations()
    }
  })

  const { data: InforConversationGroup } = useQuery({
    queryKey: ['infor-conversation-group'],
    queryFn: () => {
      return UserApi.GetInforConversationsGroup()
    }
  })

  useEffect(() => {
    if (InforConversation?.data.result[0]) {
      setInforConversations(InforConversation?.data.result[0].private_conversations)
      setUserDetail(InforConversation?.data.result[0].private_conversations[0])
      setIdUser(InforConversation?.data.result[0].private_conversations[0]._id)
    }
  }, [InforConversation?.data.result])

  useEffect(() => {
    if (InforConversationGroup?.data.result[0]) {
      setGroupDetail(InforConversationGroup?.data.result[0].group_conversations[0])
      setInforConversationsGroup(InforConversationGroup?.data.result[0].group_conversations)
    }
  }, [InforConversationGroup?.data.result])

  useEffect(() => {
    if (IdUser) {
      setMessage([])
      refetch()
    }
  }, [IdUser, refetch])

  useEffect(() => {
    if (conversations?.data.result.conversation?.length) {
      conversations?.data.result.conversation.reverse().map((conversation: any) => {
        setMessage((prev) => [...prev, conversation])
      })
      setPagination({
        page: conversations?.data.result.page,
        total_page: conversations?.data.result.total
      })
    }
  }, [conversations?.data.result.conversation, conversations?.data.result.page, conversations?.data.result.total])

  const sendMessage = (content: string) => {
    const conversation = {
      sender_id: profile?._id,
      receiver_id: IdUser,
      content: content,
      created_at: new Date(),
      updated_at: new Date(),
      _id: new Date().getTime().toString()
    }
    socket.emit('private message', {
      payload: conversation
    })
    setMessage((prevMessage) => [...prevMessage, conversation])
    const indexUser = inforConversations.findIndex((user) => user._id === IdUser)
    const userLastSender = inforConversations.splice(indexUser, 1)
    inforConversations.unshift(userLastSender[0])
  }

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (messagesSendOne.trim() === '') {
      return
    }
    sendMessage(messagesSendOne)
    setMessagesSendOne('')
  }

  const handleSendHeartIcon = () => {
    sendMessage('❤️')
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData.items
    const newImages: string[] = []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string)
              setImages((prevImages) => [...prevImages, ...newImages])
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (
      (fileFromLocal && fileFromLocal?.size >= config.maxSizeUploadAvatar) ||
      !fileFromLocal?.type.includes('image')
    ) {
      toast.error('File không hợp lệ')
    } else {
      setImages((prevImages) => [...prevImages, URL.createObjectURL(fileFromLocal)])
    }
  }

  const fetchMoreDataConversations = () => {
    if (pagination.page < pagination.total_page) {
      const scrollableDiv = document.getElementById('scrollableDiv')
      const currentScrollTop = scrollableDiv?.scrollTop || 0
      const currentScrollHeight = scrollableDiv?.scrollHeight || 0
      getConversation({ receiver_id: IdUser, limit: LIMIT_FECTH_MORE, page: pagination.page + 1 }).then((res) => {
        if (res) {
          const newMessages = res.data.result.conversation.reverse()

          setMessage((prev) => [...newMessages, ...prev])
          setPagination({
            page: res.data.result.page,
            total_page: res.data.result.total
          })

          setTimeout(() => {
            const newScrollHeight = scrollableDiv?.scrollHeight || 0
            const heightDifference = newScrollHeight - currentScrollHeight
            const scrollOffset = 100
            scrollableDiv!.scrollTop = currentScrollTop + heightDifference - scrollOffset
          }, 0)
        }
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setPickerVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='chat'>
      <div className='chat__users'>
        <div className='chat__users__title'>
          <p>Tin Nhắn</p>
          <RxPencil2 />
        </div>
        <div className='chat__users__status'>
          <div
            onClick={() => setIsPrivateConversation(true)}
            className={isPrivateConversation ? 'chat__users__status__private' : ''}
          >
            Riêng Tư
          </div>
          <div
            onClick={() => setIsPrivateConversation(false)}
            className={isPrivateConversation ? '' : 'chat__users__status__group'}
          >
            Nhóm
          </div>
        </div>
        {isPrivateConversation &&
          inforConversations.map((user) => {
            return (
              <div
                onClick={() => {
                  setIdUser(user._id), setUserDetail({ _id: user._id, name: user.name, avatar: user.avatar })
                }}
                key={user._id}
                className='chat__users__detail'
              >
                <div className='chat__users__detail__avatar'>
                  <img alt={user.avatar} src={user.avatar} />
                </div>
                <div className='chat__users__detail__name'>{user.name}</div>
              </div>
            )
          })}

        {!isPrivateConversation &&
          inforConversationsGroup.map((group) => {
            return (
              <div
                onClick={() =>
                  setGroupDetail({ _id: group._id, name: group.name, members: group.members, admin: group.admin })
                }
                key={group._id}
                className='chat__users__group'
              >
                <div className='chat__users__group_avatar'>
                  <AvatarGroup size='md' max={1}>
                    {group.members.map((member, index) => {
                      return <Avatar key={index} name={member.name} src={member.avatar} />
                    })}
                  </AvatarGroup>
                </div>
                <div className='chat_users_group_name'>{group.name}</div>
              </div>
            )
          })}
      </div>
      <div className='chat__detail'>
        <div className='chat__detail__header'>
          {isPrivateConversation ? (
            <div className='chat__detail__header__user'>
              <div className='chat__detail__header__user__avatar'>
                <img alt={userDetail.name} src={userDetail.avatar} />
              </div>
              <div className='chat__detail__header__user__name'>{userDetail.name}</div>
            </div>
          ) : (
            <div className='chat__detail__header__group'>
              <div className='chat__detail__header__group__avatar'>
                <AvatarGroup size='md' max={2}>
                  {groupDetail.members.map((member, index) => {
                    return <Avatar key={index} name={member.name} src={member.avatar} />
                  })}
                </AvatarGroup>
              </div>
              <div className='chat__detail__header__group__name'>{groupDetail.name}</div>
            </div>
          )}
          <div className='chat__detail__header__call'>
            <LuPhone /> <CiVideoOn /> <IoInformationCircleOutline />
          </div>
        </div>
        <div id='scrollableDiv' className='chat__detail__content'>
          <div>
            <InfiniteScroll
              dataLength={message.length}
              next={fetchMoreDataConversations}
              hasMore={pagination.page < pagination.total_page}
              scrollableTarget='scrollableDiv'
              loader={<p></p>}
              inverse={true}
              scrollThreshold={0.9}
            >
              {message.map((message, index) => {
                return (
                  <div
                    className={
                      message.sender_id === profile?._id
                        ? 'chat__detail__content__message-sender'
                        : 'chat__detail__content__message'
                    }
                    key={index}
                  >
                    <div className='chat__detail__content__message__avatar'>
                      {message.sender_id === profile?._id ? null : (
                        <img alt={userDetail.name} src={userDetail.avatar} />
                      )}
                    </div>
                    <p
                      className={message.sender_id === profile?._id ? '' : 'chat__detail__content__message__date'}
                      style={{ fontSize: '12px', color: '#000' }}
                    >
                      {getHourAndMinute(message.created_at as Date)}
                    </p>
                    <p
                      className={
                        message.sender_id === profile?._id
                          ? 'chat__detail__content__message__text sender'
                          : 'chat__detail__content__message__text'
                      }
                    >
                      {message.content}
                    </p>
                    <p
                      className={
                        message.sender_id === profile?._id
                          ? 'chat__detail__content__message-sender__react-sender'
                          : 'chat__detail__content__message__react'
                      }
                    >
                      <FiSmile /> <PiArrowBendUpLeftLight /> <HiOutlineDotsVertical />
                    </p>
                  </div>
                )
              })}
            </InfiniteScroll>
          </div>
        </div>
        <div className='chat__detail__input'>
          {images.length > 0 && (
            <div className='chat__detail__input__images'>
              {images.length > 0 &&
                images.map((image, index) => (
                  <div
                    key={index}
                    className='chat__detail__input__image'
                    style={{ position: 'relative', display: 'inline-block', margin: '10px', border: '1px solid black' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        cursor: 'pointer',
                        backgroundColor: '#ddd',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onClick={() => removeImage(index)}
                      className='chat__detail__input__image__icon'
                    >
                      <FaXmark size={15} />
                    </div>
                    <img src={image} alt={`Pasted ${index}`} style={{ maxWidth: '150px', maxHeight: '150px' }} />
                  </div>
                ))}
            </div>
          )}
          <div className='chat__detail__input__bottom'>
            <div className='chat__detail__input__bottom__emoj'>
              {pickerVisible && (
                <div ref={pickerRef} style={{ position: 'absolute', bottom: '100px', left: '20px' }}>
                  <Picker
                    data={data}
                    onEmojiSelect={(event: any) => {
                      setMessagesSendOne(messagesSendOne + event.native)
                    }}
                  />
                </div>
              )}
              <FiSmile onClick={() => setPickerVisible(!pickerVisible)} />
            </div>
            <form onSubmit={handleSendMessage} className='chat__detail__input__bottom__text'>
              <input
                onPaste={handlePaste}
                value={messagesSendOne}
                onChange={(event) => setMessagesSendOne(event.target.value)}
                placeholder='Nhập tin nhắn ....'
              />
            </form>

            <div className='chat__detail__input__bottom__file'>
              <AiTwotoneAudio /> <IoImageOutline onClick={handleUpload} /> <FaRegHeart onClick={handleSendHeartIcon} />
              <input onChange={onFileChange} ref={fileInputRef} type='file' style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
