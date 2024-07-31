import './Notification.scss'

interface NotificationProps {
  toggle: boolean
}

const notificationItemFake = [
  {
    avatar:
      'https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-6/440119869_963380901825300_6906465980173450642_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGOa8U0K65xG3QnvpMlUJZs93qjk4hGNu33eqOTiEY27X0mFMxIe8hp4nVSodT6JKKkSZqkWneMZ979LNAOG9sx&_nc_ohc=rCIVkqlSHRUQ7kNvgF3t-JT&_nc_ht=scontent.fhan3-1.fna&oh=00_AYBYYByjAe2-bhqnUanUAp9buidiuOzkd75v9SNtLbE9EA&oe=66B00FF4',
    name: 'Amme',
    content: 'Đã thích bài viết của bạn'
  },
  {
    avatar:
      'https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-6/440119869_963380901825300_6906465980173450642_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGOa8U0K65xG3QnvpMlUJZs93qjk4hGNu33eqOTiEY27X0mFMxIe8hp4nVSodT6JKKkSZqkWneMZ979LNAOG9sx&_nc_ohc=rCIVkqlSHRUQ7kNvgF3t-JT&_nc_ht=scontent.fhan3-1.fna&oh=00_AYBYYByjAe2-bhqnUanUAp9buidiuOzkd75v9SNtLbE9EA&oe=66B00FF4',
    name: 'Amme',
    content: 'Đã theo dõi bạn'
  }
]

const Notification = ({ toggle }: NotificationProps) => {
  return (
    <div className={toggle ? 'notification toggle' : 'searchUI'}>
      <div className='notification__title'>Thông Báo</div>
      <div className='notification__details'>
        {notificationItemFake.map((notification, index) => {
          return (
            <div key={index} className='notification__details__item'>
              <div className='notification__details__item__avatar'>
                <img src={notification.avatar} alt='' />
              </div>
              <div className='notification__details__item__content'>
                {notification.name} {notification.content}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notification
