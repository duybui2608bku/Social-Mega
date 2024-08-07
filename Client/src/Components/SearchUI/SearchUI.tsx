import './SearchUI.scss'

interface SearchUIProps {
  toggle: boolean
}

const userFake = [
  {
    avatar:
      'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/338542677_911657383288229_231872306489757536_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=efbe48&_nc_ohc=VdY-YzrulBYQ7kNvgHqq_NN&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYCvaWlD_3jhooxg7_b1YYiZOC_ow8D8Bd5iizSVBRnulQ&oe=66B8E771',
    name: 'Amme'
  },
  {
    avatar:
      'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/338542677_911657383288229_231872306489757536_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=efbe48&_nc_ohc=VdY-YzrulBYQ7kNvgHqq_NN&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYCvaWlD_3jhooxg7_b1YYiZOC_ow8D8Bd5iizSVBRnulQ&oe=66B8E771',
    name: 'lady Mây'
  },
  {
    avatar:
      'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/338542677_911657383288229_231872306489757536_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=efbe48&_nc_ohc=VdY-YzrulBYQ7kNvgHqq_NN&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYCvaWlD_3jhooxg7_b1YYiZOC_ow8D8Bd5iizSVBRnulQ&oe=66B8E771',
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
