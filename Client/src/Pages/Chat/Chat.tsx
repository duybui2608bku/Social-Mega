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
import { getConversation, getConversationGroup } from 'src/Service/Conversations.api'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery } from '@tanstack/react-query'
import { getFileInfoFromUrl, getHourAndMinute, getIconFile, isUrl } from 'src/Utils/Other'
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
import { Avatar, AvatarGroup, Spinner } from '@chakra-ui/react'
import { socketIOConversations } from 'src/constants/socketIO.config'
import { uploadDocuments, uploadImages, uploadVideos } from 'src/Service/Medias.api'
import { Media } from 'src/Types/Medias.type'

const Chat = () => {
  const LIMIT = 15
  const LIMIT_FECTH_MORE = 3
  const PAGE = 1
  interface Message {
    _id: string
    sender_id: string | undefined
    receiver_id: string | undefined
    content: string | undefined
    image_url?: string[]
    video_url?: string[]
    document_url?: Media[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  interface MessageGroup {
    _id: string
    sender_id: string | undefined
    group_id: string | undefined
    content: string | undefined
    image_url?: string[]
    video_url?: string[]
    document_url?: Media[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  const { profile } = useContext(AppContext)
  const [imageFile, setImageFile] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File[]>([])
  const [documentFile, setDocumentFile] = useState<File[]>([])
  const [messagesSendOne, setMessagesSendOne] = useState('')
  const [IdUser, setIdUser] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [message, setMessage] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: PAGE, total_page: 0 })
  const [pickerVisible, setPickerVisible] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const [inforConversations, setInforConversations] = useState<PrivateConversation>([])
  const [inforConversationsGroup, setInforConversationsGroup] = useState<GroupConversationType[]>([])
  const [conversationGroupMessage, setConversationGroupMessage] = useState<MessageGroup[]>([])
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
        socket.on(socketIOConversations.RECEIVE_PRIVATE_MESSAGE, (data) => {
          const { payload } = data
          setMessage((conversation) => [...conversation, payload])
        })

        socket.on(socketIOConversations.RECEIVE_GROUP_MESSAGE, (data) => {
          const { payload } = data
          setConversationGroupMessage((conversation) => [...conversation, payload])
        })

        socket.on(socketIOConversations.CONNECT_ERROR, (error) => {
          console.log('Socket connection error:', error)
        })
      }, 1000)
      return () => {
        clearTimeout(timer)
        socket.disconnect()
      }
    }
  }, [profile?._id])

  const { data: conversations, refetch: refechConversations } = useQuery({
    queryKey: ['conversation'],
    queryFn: () => {
      if (IdUser) {
        return getConversation({ receiver_id: IdUser, limit: LIMIT, page: PAGE })
      }
      return Promise.resolve(null)
    },
    enabled: !!IdUser
  })

  const { data: conversationsGroup, refetch: refetchConversationsGroup } = useQuery({
    queryKey: ['conversation-group'],
    queryFn: () => {
      if (groupDetail._id) {
        return getConversationGroup({ group_id: groupDetail._id, limit: LIMIT, page: PAGE })
      }
      return Promise.resolve(null)
    },
    enabled: !!groupDetail._id
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
      refechConversations()
    }
    if (groupDetail._id) {
      setConversationGroupMessage([])
      refetchConversationsGroup()
    }
  }, [IdUser, groupDetail, refechConversations, refetchConversationsGroup])

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

  useEffect(() => {
    if (conversationsGroup?.data.result.conversationGroupMessages?.length) {
      conversationsGroup?.data.result.conversationGroupMessages.reverse().map((conversation: any) => {
        setConversationGroupMessage((prev) => [...prev, conversation])
      })
      setPagination({
        page: conversationsGroup?.data.result.page,
        total_page: conversationsGroup?.data.result.total
      })
    }
  }, [
    conversationsGroup?.data.result.conversationGroupMessages,
    conversationsGroup?.data.result.page,
    conversationsGroup?.data.result.total
  ])

  const sendMessage = async (content: string) => {
    setLoading(true)

    let imageUrls: string[] = []
    let videoUrls: string[] = []
    let documentUrls: Media[] = []
    try {
      if (imageFile.length > 0 && videoFile.length === 0) {
        const formData = new FormData()
        imageFile.forEach((file) => {
          formData.append('image', file)
        })
        const response = await uploadImages(formData)
        imageUrls = response.data.result.map((image: any) => image.url)
      }

      if (videoFile.length > 0 && imageFile.length === 0) {
        const formData = new FormData()
        videoFile.forEach((file) => {
          formData.append('video', file)
        })
        const response = await uploadVideos(formData)
        videoUrls = response.data.result.map((video: any) => video.url)
      }

      if (documentFile.length > 0 && imageFile.length === 0 && videoFile.length === 0) {
        const formData = new FormData()
        documentFile.forEach((file) => {
          formData.append('document', file)
        })
        const response = await uploadDocuments(formData)
        documentUrls = response.data.result.map((document: any) => document)
      }

      const conversation = {
        sender_id: profile?._id,
        receiver_id: IdUser,
        content: content,
        image_url: imageUrls,
        video_url: videoUrls,
        document_url: documentUrls,
        created_at: new Date(),
        updated_at: new Date(),
        _id: new Date().getTime().toString()
      }

      socket.emit(socketIOConversations.PRIVATE_MESSAGE, {
        payload: conversation
      })

      setMessage((prevMessage) => [...prevMessage, conversation])
      setImageFile([])
      setVideoFile([])
      setImages([])
      setVideos([])
      setDocumentFile([])
      setDocuments([])
      const indexUser = inforConversations.findIndex((user) => user._id === IdUser)
      const userLastSender = inforConversations.splice(indexUser, 1)
      setInforConversations([userLastSender[0], ...inforConversations])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }
  const sendMessageGroup = async (content: string) => {
    setLoading(true)

    let imageUrls: string[] = []
    let videoUrls: string[] = []
    let documentUrls: Media[] = []
    try {
      if (imageFile.length > 0 && videoFile.length === 0) {
        const formData = new FormData()
        imageFile.forEach((file) => {
          formData.append('image', file)
        })
        const response = await uploadImages(formData)
        imageUrls = response.data.result.map((image: any) => image.url)
      }

      if (videoFile.length > 0 && imageFile.length === 0) {
        const formData = new FormData()
        videoFile.forEach((file) => {
          formData.append('video', file)
        })
        const response = await uploadVideos(formData)
        videoUrls = response.data.result.map((video: any) => video.url)
      }

      if (documentFile.length > 0 && imageFile.length === 0 && videoFile.length === 0) {
        const formData = new FormData()
        documentFile.forEach((file) => {
          formData.append('document', file)
        })
        const response = await uploadDocuments(formData)
        documentUrls = response.data.result.map((document: any) => document)
      }

      const conversationsGroupMessage = {
        sender_id: profile?._id,
        group_id: groupDetail._id,
        content: content,
        image_url: imageUrls,
        video_url: videoUrls,
        document_url: documentUrls,
        created_at: new Date(),
        updated_at: new Date(),
        _id: new Date().getTime().toString()
      }

      socket.emit(socketIOConversations.GROUP_MESSAGE, {
        payload: conversationsGroupMessage
      })

      setConversationGroupMessage((prevMessage) => [...prevMessage, conversationsGroupMessage])
      setImageFile([])
      setVideoFile([])
      setImages([])
      setVideos([])
      setDocumentFile([])
      setDocuments([])
      const indexGroup = inforConversationsGroup.findIndex((group) => group._id === groupDetail._id)
      const groupLastSender = inforConversationsGroup.splice(indexGroup, 1)
      setInforConversationsGroup([groupLastSender[0], ...inforConversationsGroup])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (messagesSendOne.trim() === '' && images.length === 0 && videos.length === 0 && documentFile.length === 0) {
      return
    }
    isPrivateConversation ? sendMessage(messagesSendOne) : sendMessageGroup(messagesSendOne)
    setMessagesSendOne('')
  }

  const handleSendHeartIcon = () => {
    sendMessage('❤️')
    sendMessageGroup('❤️')
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
              setImageFile((prevImages) => [...prevImages, file])
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
    if (!fileFromLocal) {
      return
    }
    const isImage = fileFromLocal.type.startsWith('image/')
    const isVideo = fileFromLocal.type.startsWith('video/')
    const isExcel =
      fileFromLocal.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileFromLocal.type === 'application/vnd.ms-excel'
    const isWord =
      fileFromLocal.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileFromLocal.type === 'application/msword'
    const isPDF = fileFromLocal.type === 'application/pdf'
    const isPowerPoint =
      fileFromLocal.type === 'application/vnd.ms-powerpoint' ||
      fileFromLocal.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    if (
      fileFromLocal.size >= config.maxSizeUploadImage ||
      fileFromLocal.size >= config.maxSizeUploadVideo ||
      fileFromLocal.size >= config.maxSizeUploadDocument ||
      (!isImage && !isVideo && !isExcel && !isWord && !isPDF && !isPowerPoint)
    ) {
      toast.error('File không hợp lệ')
    } else {
      const fileURL = URL.createObjectURL(fileFromLocal)
      if (isImage) {
        setImageFile((filePrevios) => [...filePrevios, fileFromLocal])
        setImages((prevImages) => [...prevImages, fileURL])
      } else if (isVideo) {
        setVideos((prevVideos) => [...prevVideos, fileURL])
        setVideoFile((prevVideos) => [...prevVideos, fileFromLocal])
      } else if (isExcel || isWord || isPDF || isPowerPoint) {
        setDocumentFile((prevDocument) => [...prevDocument, fileFromLocal])
        setDocuments((prevDocument) => [...prevDocument, fileURL])
      }
    }
  }

  if (videos.length >= 3 || images.length >= 10 || documents.length >= 5) {
    toast.error('Số lượng file upload không được vượt quá 10 file ảnh, 5 file video và 5 file tài liệu')
  }
  if (videos.length > 0 && images.length > 0 && documentFile.length > 0) {
    toast.error('Chỉ được upload 1 loại file')
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

  const fetchMoreDataConversationsGroup = () => {
    if (pagination.page < pagination.total_page) {
      const scrollableDiv = document.getElementById('scrollableDiv')
      const currentScrollTop = scrollableDiv?.scrollTop || 0
      const currentScrollHeight = scrollableDiv?.scrollHeight || 0
      getConversationGroup({ group_id: groupDetail._id, limit: LIMIT_FECTH_MORE, page: pagination.page + 1 }).then(
        (res) => {
          if (res) {
            const newMessages = res.data.result.conversationGroupMessages.reverse()

            setConversationGroupMessage((prev) => [...newMessages, ...prev])
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
        }
      )
    }
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setImageFile((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index))
    setVideoFile((prevVideos) => prevVideos.filter((_, i) => i !== index))
  }

  const removeDocument = (index: number) => {
    setDocuments((prevDocument) => prevDocument.filter((_, i) => i !== index))
    setDocumentFile((prevDocument) => prevDocument.filter((_, i) => i !== index))
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
                <div className='chat__users__group__name'>{group.name}</div>
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
          {isPrivateConversation ? (
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
                  const isSender = message.sender_id === profile?._id

                  return (
                    <div
                      className={isSender ? 'chat__detail__content__message-sender' : 'chat__detail__content__message'}
                      key={index}
                    >
                      {!isSender && (
                        <div className='chat__detail__content__message__avatar'>
                          <img alt={userDetail.name} src={userDetail.avatar} />
                        </div>
                      )}
                      <p
                        className={isSender ? '' : 'chat__detail__content__message__date'}
                        style={{ fontSize: '12px', color: '#000' }}
                      >
                        {getHourAndMinute(message.created_at as Date)}
                      </p>

                      {message.content ||
                      (message.image_url?.length ?? 0) > 0 ||
                      (message.video_url?.length ?? 0) > 0 ||
                      (message.document_url?.length ?? 0) > 0 ? (
                        <div
                          className={
                            message.sender_id === profile?._id
                              ? 'chat__detail__content__message__sender'
                              : 'chat__detail__content__message__receiver'
                          }
                        >
                          {message.content &&
                            (isUrl(message.content) ? (
                              <a
                                href={message.content}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={
                                  isSender
                                    ? 'chat__detail__content__message__text sender'
                                    : 'chat__detail__content__message__text'
                                }
                              >
                                {message.content}
                              </a>
                            ) : (
                              <p
                                className={
                                  isSender
                                    ? 'chat__detail__content__message__text sender'
                                    : 'chat__detail__content__message__text'
                                }
                              >
                                {message.content}
                              </p>
                            ))}

                          {(message.image_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message__images'>
                              {message?.image_url?.map((image, index) => (
                                <div className='chat__detail__content__message__images__item' key={index}>
                                  <img src={image} alt={`Pasted ${index}`} />
                                </div>
                              ))}
                            </div>
                          )}

                          {(message.video_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message__video'>
                              {message?.video_url?.map((video, index) => (
                                <div className='chat__detail__content__message__video__item' key={index}>
                                  <video controls>
                                    <track src='captions.vtt' kind='captions' label='English' default />
                                    <source src={video} type='video/mp4' />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ))}
                            </div>
                          )}

                          {(message.document_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message__documents'>
                              {message?.document_url?.map((doc, index) => {
                                const fileExtension = getFileInfoFromUrl(doc.url)
                                const IconComponent = getIconFile(fileExtension)
                                return (
                                  <div
                                    style={{ width: 'fit-content' }}
                                    className='chat__detail__content__message__documents__item'
                                    key={index}
                                  >
                                    <a
                                      className={
                                        message.sender_id === profile?._id
                                          ? 'chat__detail__content__message__documents__item__sender'
                                          : 'chat__detail__content__message__documents__item__receiver'
                                      }
                                      href={doc.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                    >
                                      {doc.name}
                                      <IconComponent style={{ minWidth: '50px ', minHeight: '50px' }} />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <p
                        className={
                          isSender
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
          ) : (
            <div>
              <InfiniteScroll
                dataLength={conversationGroupMessage.length}
                next={fetchMoreDataConversationsGroup}
                hasMore={pagination.page < pagination.total_page}
                scrollableTarget='scrollableDiv'
                loader={<p></p>}
                inverse={true}
                scrollThreshold={0.9}
              >
                {conversationGroupMessage.map((message, index) => {
                  const sender = groupDetail.members.find((member) => member._id === message.sender_id)
                  return (
                    <div
                      key={index}
                      className={
                        message.sender_id === profile?._id
                          ? 'chat__detail__content__message-group-sender'
                          : 'chat__detail__content__message-group'
                      }
                    >
                      {message.sender_id === profile?._id ? null : (
                        <p style={{ position: 'absolute', fontSize: '12px', top: '-20px', left: '65px' }}>
                          {sender?.name}
                        </p>
                      )}
                      <div className='chat__detail__content__message-group__avatar'>
                        {message.sender_id === profile?._id ? null : <img alt={sender?.name} src={sender?.avatar} />}
                      </div>
                      <p
                        className={
                          message.sender_id === profile?._id ? '' : 'chat__detail__content__message-group__date'
                        }
                        style={{ fontSize: '12px', color: '#000' }}
                      >
                        {getHourAndMinute(message.created_at as Date)}
                      </p>
                      {(message.content ||
                        (message.image_url?.length ?? 0) > 0 ||
                        (message.video_url?.length ?? 0) > 0 ||
                        (message.document_url?.length ?? 0) > 0) && (
                        <div
                          className={
                            message.sender_id === profile?._id
                              ? 'chat__detail__content__message-group__sender'
                              : 'chat__detail__content__message-group__receiver'
                          }
                        >
                          {message.content && (
                            <p
                              className={
                                message.sender_id === profile?._id
                                  ? 'chat__detail__content__message-group__text sender'
                                  : 'chat__detail__content__message-group__text receiver'
                              }
                            >
                              {message.content}
                            </p>
                          )}
                          {(message.image_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message-group__images'>
                              {message?.image_url?.map((image, index) => (
                                <div className='chat__detail__content__message-group__images__items' key={index}>
                                  <img src={image} alt={`Pasted ${index}`} />
                                </div>
                              ))}
                            </div>
                          )}
                          {(message.video_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message-group__video'>
                              {message?.video_url?.map((video, index) => (
                                <div className='chat__detail__content__message-group__video__item' key={index}>
                                  <video controls>
                                    <track src='captions.vtt' kind='captions' label='English' default />
                                    <source src={video} type='video/mp4' />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ))}
                            </div>
                          )}
                          {(message.document_url?.length ?? 0) > 0 && (
                            <div className='chat__detail__content__message-group__documents'>
                              {message?.document_url?.map((doc, index) => {
                                const fileExtension = getFileInfoFromUrl(doc.url)
                                const IconComponent = getIconFile(fileExtension)
                                return (
                                  <div className='chat__detail__content__message-group__documents__item' key={index}>
                                    <a
                                      className={
                                        message.sender_id === profile?._id
                                          ? 'chat__detail__content__message-group__documents__item__sender'
                                          : 'chat__detail__content__message-group__documents__item__receiver'
                                      }
                                      href={doc.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                    >
                                      {doc.name}
                                      <IconComponent style={{ minWidth: '50px', minHeight: '50px' }} />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      <p
                        className={
                          message.sender_id === profile?._id
                            ? 'chat__detail__content__message-group-sender__react-sender'
                            : 'chat__detail__content__message-group__react'
                        }
                      >
                        <FiSmile /> <PiArrowBendUpLeftLight /> <HiOutlineDotsVertical />
                      </p>
                    </div>
                  )
                })}
              </InfiniteScroll>
            </div>
          )}
        </div>
        <div className='chat__detail__input'>
          {images.length > 0 && (
            <div className='chat__detail__input__images'>
              {images.length > 0 &&
                images.map((image, index) => (
                  <div
                    key={index}
                    className='chat__detail__input__image'
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      margin: '10px',
                      border: '1px solid black'
                    }}
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
                    {loading ? (
                      <Spinner
                        style={{
                          position: 'absolute',
                          left: '35%',
                          top: '25%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 99
                        }}
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='sm'
                      />
                    ) : null}
                    <img src={image} alt={`Pasted ${index}`} style={{ maxWidth: '150px', maxHeight: '150px' }} />
                  </div>
                ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className='chat__detail__input__videos'>
              {videos.length > 0 &&
                videos.map((video, index) => (
                  <div
                    key={index}
                    className='chat__detail__input__video'
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      margin: '10px',
                      border: '1px solid black',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      maxWidth: '150px',
                      maxHeight: '200px',
                      width: 'auto',
                      height: 'auto'
                    }}
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
                        alignItems: 'center',
                        zIndex: 99
                      }}
                      onClick={() => removeVideo(index)}
                      className='chat__detail__input__image__icon'
                    >
                      <FaXmark size={15} />
                    </div>
                    {loading ? (
                      <Spinner
                        style={{
                          position: 'absolute',
                          left: '35%',
                          top: '25%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 99
                        }}
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                      />
                    ) : null}
                    <video src={video} style={{ maxWidth: '150px', maxHeight: '150px' }} controls>
                      Your browser does not support the video tag.
                      <track src='captions.vtt' kind='captions' label='English' default />
                    </video>
                  </div>
                ))}
            </div>
          )}
          {documents.length > 0 && (
            <div className='chat__detail__input__documents'>
              {documents.length > 0 &&
                documents.map((doc, index) => (
                  <div
                    key={index}
                    className='chat__detail__input__document'
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      margin: '10px',
                      border: '1px solid black',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      width: 'auto',
                      height: 'auto'
                    }}
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
                        alignItems: 'center',
                        zIndex: 99
                      }}
                      onClick={() => removeDocument(index)}
                      className='chat__detail__input__document__icon'
                    >
                      <FaXmark size={15} />
                    </div>
                    {loading ? (
                      <Spinner
                        style={{
                          position: 'absolute',
                          left: '35%',
                          top: '25%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 99
                        }}
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                      />
                    ) : null}
                    <iframe title={doc} src={doc}></iframe>
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
