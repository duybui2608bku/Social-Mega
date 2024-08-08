import './Chat.scss'
import { LuPhone } from 'react-icons/lu'
import { CiVideoOn } from 'react-icons/ci'
import { IoInformationCircleOutline, IoImageOutline } from 'react-icons/io5'
import { FiSmile } from 'react-icons/fi'
import { AiTwotoneAudio } from 'react-icons/ai'
import { FaRegHeart } from 'react-icons/fa6'
import { useContext, useEffect, useState } from 'react'
import socket from 'src/Utils/socketIO'
import { AppContext } from 'src/Context/App.context'
import { FaXmark } from 'react-icons/fa6'
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
      name: 'Nguyễn Phương Nhi',
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

  const { profile } = useContext(AppContext)
  interface Message {
    content: string
    isSender: boolean
  }
  const [messagesSendOne, setMessagesSendOne] = useState('')
  const [messagesReceive, setMessagesReceive] = useState<Message[]>([])
  const [IdUser, setIdUser] = useState<string>('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    socket.auth = {
      _id: profile?._id
    }
    socket.connect()
    socket.on('receive private message', (data) => {
      setMessagesReceive((message) => [
        ...message,
        {
          content: data.content,
          isSender: false
        }
      ])
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    if (messagesSendOne === '') {
      return
    }
    event.preventDefault()
    socket.emit('private message', {
      content: messagesSendOne,
      to: IdUser
    })
    setMessagesSendOne('')
    setMessagesReceive((prev) => [
      ...prev,
      {
        content: messagesSendOne,
        isSender: true
      }
    ])
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

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  console.log(images)

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
        <div className='chat__detail__content'>
          <div>
            {messagesReceive.map((message, index) => {
              return (
                <div
                  className={
                    message.isSender ? 'chat__detail__content__message-sender' : 'chat__detail__content__message'
                  }
                  key={index}
                >
                  <div className='chat__detail__content__message__avatar'>
                    {message.isSender ? null : <img alt={userDetail.name} src={userDetail.avatar} />}
                  </div>
                  <p
                    className={
                      message.isSender
                        ? 'chat__detail__content__message__text sender'
                        : 'chat__detail__content__message__text'
                    }
                  >
                    {message.content}
                  </p>
                </div>
              )
            })}
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
