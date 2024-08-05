import './Chat.scss'
import { LuPhone } from 'react-icons/lu'
import { CiVideoOn } from 'react-icons/ci'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { FiSmile } from 'react-icons/fi'
import { AiTwotoneAudio } from 'react-icons/ai'
import { IoImageOutline } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa6'
const Chat = () => {
  const userFake = [
    {
      _id: '1',
      name: 'Nguyễn Văn A',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '2',
      name: 'Nguyễn Văn B',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '3',
      name: 'Nguyễn Văn C',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '4',
      name: 'Nguyễn Văn D',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '5',
      name: 'Nguyễn Văn A',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '6',
      name: 'Nguyễn Văn B',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '7',
      name: 'Nguyễn Văn C',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '8',
      name: 'Nguyễn Văn D',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '9',
      name: 'Nguyễn Văn C',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    },
    {
      _id: '10',
      name: 'Nguyễn Văn D',
      avatar:
        'https://scontent.cdninstagram.com/v/t51.2885-19/413856789_720235946744654_18997929553714076_n.jpg?stp=dst-jpg_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=gWLb7Wi7WLwQ7kNvgF3A_AA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYBe6-Nsj65N7dct9PhsaV0hr50jlvC_PxR4Cx_2S5ZdtA&oe=66B3FB86'
    }
  ]
  const userDetail = {
    _id: '1',
    name: 'Phương Nhi',
    avatar:
      'https://scontent.cdninstagram.com/v/t51.2885-19/450538020_875865001033913_4586504415322551856_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=fcb8ef&_nc_ohc=G2QFAZSzNTcQ7kNvgGMDjlt&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AYCtSpMosHvWsxx0ZzEu52VmbYZ5Q1Rd8z20UMhKBc6qZg&oe=66B41D85'
  }

  return (
    <div className='chat'>
      <div className='chat__users'>
        <div className='chat__users__title'>Tin Nhắn</div>
        {userFake.map((user) => {
          return (
            <div key={user._id} className='chat__users__detail'>
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
        <div className='chat__detail__content'></div>
        <div className='chat__detail__input'>
          <div className='chat__detail__input__emoj'>
            <FiSmile />
          </div>
          <input className='chat__detail__input__text' placeholder='Nhập tin nhắn ....' />
          <div className='chat__detail__input__file'>
            <AiTwotoneAudio /> <IoImageOutline /> <FaRegHeart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
