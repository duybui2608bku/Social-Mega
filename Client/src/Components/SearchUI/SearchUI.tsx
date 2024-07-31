import './SearchUI.scss'

interface SearchUIProps {
  toggle: boolean
}

const userFake = [
  {
    avatar:
      'https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-6/440119869_963380901825300_6906465980173450642_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGOa8U0K65xG3QnvpMlUJZs93qjk4hGNu33eqOTiEY27X0mFMxIe8hp4nVSodT6JKKkSZqkWneMZ979LNAOG9sx&_nc_ohc=rCIVkqlSHRUQ7kNvgF3t-JT&_nc_ht=scontent.fhan3-1.fna&oh=00_AYBYYByjAe2-bhqnUanUAp9buidiuOzkd75v9SNtLbE9EA&oe=66B00FF4',
    name: 'Amme'
  },
  {
    avatar:
      'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/273737774_1042315853367650_6682147449894872199_n.jpg?stp=dst-jpg_p206x206&_nc_cat=110&ccb=1-7&_nc_sid=efbe48&_nc_eui2=AeGzZNSXOJggcNQ1uc5OtZBKmzNM_n0yZF6bM0z-fTJkXuAv_WyxfYgUvXyw2NTK_HH-dUffH8uHCiBoJOMSHj7u&_nc_ohc=9o6hFtaj1_cQ7kNvgGAIi8Y&_nc_ht=scontent.fhan4-6.fna&gid=ArE-jn7enPbnPJMpE9Ee67J&oh=00_AYDNCmntcdRNppL4YkzArrAhccRyYe0p8f3lquFdnoX7rQ&oe=66B019B5',
    name: 'lady Mây'
  },
  {
    avatar:
      'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/273737774_1042315853367650_6682147449894872199_n.jpg?stp=dst-jpg_p206x206&_nc_cat=110&ccb=1-7&_nc_sid=efbe48&_nc_eui2=AeGzZNSXOJggcNQ1uc5OtZBKmzNM_n0yZF6bM0z-fTJkXuAv_WyxfYgUvXyw2NTK_HH-dUffH8uHCiBoJOMSHj7u&_nc_ohc=9o6hFtaj1_cQ7kNvgGAIi8Y&_nc_ht=scontent.fhan4-6.fna&gid=ArE-jn7enPbnPJMpE9Ee67J&oh=00_AYDNCmntcdRNppL4YkzArrAhccRyYe0p8f3lquFdnoX7rQ&oe=66B019B5',
    name: 'Đức Phúc'
  }
]

const SearchUI = ({ toggle }: SearchUIProps) => {
  return (
    <div className={toggle ? 'searchUI toggle' : 'searchUI'}>
      <div className='searchUI__form'>
        <div className='searchUI__form__title'>Tìm Kiếm</div>
        <div className='searchUI__form__input'>
          <input type='text' placeholder='Tìm kiếm...' />
        </div>
      </div>
      <div className='searchUI__results'>
        {userFake.map((user, index) => {
          return (
            <>
              <div key={index} className='searchUI__results__user'>
                <div className='searchUI__results__user__avatar'>
                  <img src={user.avatar} alt='' />
                </div>
                <div className='searchUI__results__user__name'>{user.name}</div>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default SearchUI
