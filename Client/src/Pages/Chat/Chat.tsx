import './Chat.scss'
import { LuPhone } from 'react-icons/lu'
import { CiVideoOn } from 'react-icons/ci'
import { IoInformationCircleOutline, IoImageOutline } from 'react-icons/io5'
import { FiSmile } from 'react-icons/fi'
import { AiTwotoneAudio } from 'react-icons/ai'
import { FaRegHeart, FaXmark } from 'react-icons/fa6'
import { useContext, useEffect, useState } from 'react'
import socket from 'src/Utils/socketIO'
import { AppContext } from 'src/Context/App.context'
import { useQuery } from '@tanstack/react-query'
import { getConversation } from 'src/Service/Conversations'
import InfiniteScroll from 'react-infinite-scroll-component'

const Chat = () => {
  const userFake = [
    {
      _id: '66ac8dc0ce862139d991e55a',
      name: 'Bùi Nhật Duy',
      avatar:
        'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/453979428_1019012882928768_5051986297995540054_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=mpJqxHnutekQ7kNvgGjmCnT&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYD1T1IO6n3Gn4UHzfcruCPwNbO_Lf-Qc1udYeyqmuNGBA&oe=66BA0ECC'
    },
    {
      _id: '66b1e9c49572c42beb598727',
      name: 'Nguyễn Phương Nhi Nhi',
      avatar:
        'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/453979428_1019012882928768_5051986297995540054_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=mpJqxHnutekQ7kNvgGjmCnT&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYD1T1IO6n3Gn4UHzfcruCPwNbO_Lf-Qc1udYeyqmuNGBA&oe=66BA0ECC'
    }
  ]
  const userDetail = {
    _id: '1',
    name: 'Phương Nhi',
    avatar:
      'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/453979428_1019012882928768_5051986297995540054_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=mpJqxHnutekQ7kNvgGjmCnT&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYD1T1IO6n3Gn4UHzfcruCPwNbO_Lf-Qc1udYeyqmuNGBA&oe=66BA0ECC'
  }

  const LIMIT = 10
  const PAGE = 1

  const { profile } = useContext(AppContext)
  const [messagesSendOne, setMessagesSendOne] = useState('')
  const [IdUser, setIdUser] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [message, setMessage] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: PAGE, total_page: 0 })
  console.log(pagination)
  useEffect(() => {
    socket.auth = {
      _id: profile?._id
    }
    socket.connect()
    socket.on('receive private message', (data) => {
      const { payload } = data
      setMessage((conversation) => [...conversation, payload])
    })
    return () => {
      socket.disconnect()
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

  useEffect(() => {
    if (IdUser) {
      setMessage([])
      refetch()
    }
  }, [IdUser, refetch])

  useEffect(() => {
    if (conversations?.data.result.conversation?.length) {
      conversations?.data.result.conversation.reverse().map((conversation) => {
        setMessage((prev) => [...prev, conversation])
      })
      setPagination({
        page: conversations?.data.result.page,
        total_page: conversations?.data.result.total
      })
    }
  }, [conversations?.data.result.conversation])

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    if (messagesSendOne.trim() === '') {
      return
    }

    event.preventDefault()
    const conversation = {
      sender_id: profile?._id,
      receiver_id: IdUser,
      content: messagesSendOne,
      _id: new Date().getTime().toString()
    }

    socket.emit('private message', {
      payload: conversation
    })
    setMessage((prevMessage) => [...prevMessage, conversation])
    setMessagesSendOne('')
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

  const fetchMoreDataConversations = () => {
    if (pagination.page < Math.ceil(pagination.total_page / LIMIT)) {
      getConversation({ receiver_id: IdUser, limit: LIMIT, page: pagination.page + 1 }).then((res) => {
        if (res) {
          res.data.result.conversation.reverse().map((conversation) => {
            setMessage((prev) => [conversation, ...prev])
          })
          setPagination({
            page: res.data.result.page,
            total_page: res.data.result.total
          })
        }
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  console.log(pagination.page < pagination.total_page / LIMIT)

  return (
    <div className='chat'>
      <div className='chat__users'>
        <div className='chat__users__title'>Tin Nhắn</div>
        {userFake.map((user) => {
          return (
            <div onClick={() => setIdUser(user._id)} key={user._id} className='chat__users__detail'>
              <div className='chat__users__detail__avatar'>
                <img alt={user.name} src={user.avatar} />
              </div>
              <div className='chat__users__detail__name'>{user.name}</div>
            </div>
          )
        })}
      </div>
      <div className='chat__detail'>
        <div className='chat__detail__header'>
          <div className='chat__detail__header__user'>
            <div className='chat__detail__header__user__avatar'>
              <img alt={userDetail.name} src={userDetail.avatar} />
            </div>
            <div className='chat__detail__header__user__name'>{userDetail.name}</div>
          </div>
          <div className='chat__detail__header__call'>
            <LuPhone /> <CiVideoOn /> <IoInformationCircleOutline />
          </div>
        </div>
        <div id='scrollableDiv' className='chat__detail__content'>
          <div>
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
                    {message.sender_id === profile?._id ? null : <img alt={userDetail.name} src={userDetail.avatar} />}
                  </div>
                  <p
                    className={
                      message.sender_id === profile?._id
                        ? 'chat__detail__content__message__text sender'
                        : 'chat__detail__content__message__text'
                    }
                  >
                    {message.content}
                  </p>
                </div>
              )
            })}
            <InfiniteScroll
              dataLength={message.length}
              next={fetchMoreDataConversations}
              hasMore={pagination.page < pagination.total_page}
              scrollableTarget='scrollableDiv'
              loader={<p></p>}
              inverse={true}
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
                      className={
                        message.sender_id === profile?._id
                          ? 'chat__detail__content__message__text sender'
                          : 'chat__detail__content__message__text'
                      }
                    >
                      {message.content}
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
              <FiSmile />
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
              <AiTwotoneAudio /> <IoImageOutline /> <FaRegHeart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
