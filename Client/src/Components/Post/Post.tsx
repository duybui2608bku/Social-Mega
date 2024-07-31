import { FaRegHeart } from 'react-icons/fa6'
import { FaRegComment } from 'react-icons/fa6'
import { PiPaperPlaneTiltBold } from 'react-icons/pi'
import { FaRegBookmark } from 'react-icons/fa6'
import './Post.scss'
import { useState } from 'react'

const Post = () => {
  const [more, setMore] = useState<Boolean>(false)
  const handleSeeMore = () => {
    setMore(!more)
  }

  const postItem = [
    {
      avatar:
        'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/437859980_954554949374562_8329538841922092765_n.jpg?stp=c0.23.206.206a_dst-jpg_p206x206&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeERfAcL3EGPp6DzbqTlhuVu2cIqh-ukZLDZwiqH66RksLdPQadOxscNRSTNbodM0jBsAoUj1bU5nsmIiXxboO7d&_nc_ohc=fhKMQ4wG5HkQ7kNvgHkXcWq&_nc_ht=scontent.fhan4-1.fna&oh=00_AYANEhzEWOmWGfO-L6YyCiP3ZtO0HirR5BfOIjLEFycTJg&oe=66B032FC',
      username: 'Duy Muối',
      img: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/437859980_954554949374562_8329538841922092765_n.jpg?stp=c0.23.206.206a_dst-jpg_p206x206&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeERfAcL3EGPp6DzbqTlhuVu2cIqh-ukZLDZwiqH66RksLdPQadOxscNRSTNbodM0jBsAoUj1bU5nsmIiXxboO7d&_nc_ohc=fhKMQ4wG5HkQ7kNvgHkXcWq&_nc_ht=scontent.fhan4-1.fna&oh=00_AYANEhzEWOmWGfO-L6YyCiP3ZtO0HirR5BfOIjLEFycTJg&oe=66B032FC',
      like: 246,
      comment: 20,
      content:
        'Theo quy định này, các nhà điều hành doanh nghiệp địa phương cần xây dựng dựng môi trường làm việc tràn ngập tiếng cười. Họ có trách nhiệm thúc đẩy nhân viên cười nhiều hơn mỗi ngày, Yomiuri đưa tin. Người dân sinh sống và làm việc tại Yamagata được khuyến khích cười mỉm, cười khúc khích hoặc cười thành tiếng hàng ngày. Ngày thứ 8 hàng tháng cũng được chỉ định là ngày “người dân hành động vì sức khỏe thông qua những tiếng cười”'
    },
    {
      avatar:
        'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/437859980_954554949374562_8329538841922092765_n.jpg?stp=c0.23.206.206a_dst-jpg_p206x206&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeERfAcL3EGPp6DzbqTlhuVu2cIqh-ukZLDZwiqH66RksLdPQadOxscNRSTNbodM0jBsAoUj1bU5nsmIiXxboO7d&_nc_ohc=fhKMQ4wG5HkQ7kNvgHkXcWq&_nc_ht=scontent.fhan4-1.fna&oh=00_AYANEhzEWOmWGfO-L6YyCiP3ZtO0HirR5BfOIjLEFycTJg&oe=66B032FC',
      username: 'Duy Muối',
      img: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/437859980_954554949374562_8329538841922092765_n.jpg?stp=c0.23.206.206a_dst-jpg_p206x206&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeERfAcL3EGPp6DzbqTlhuVu2cIqh-ukZLDZwiqH66RksLdPQadOxscNRSTNbodM0jBsAoUj1bU5nsmIiXxboO7d&_nc_ohc=fhKMQ4wG5HkQ7kNvgHkXcWq&_nc_ht=scontent.fhan4-1.fna&oh=00_AYANEhzEWOmWGfO-L6YyCiP3ZtO0HirR5BfOIjLEFycTJg&oe=66B032FC',
      like: 246,
      comment: 20,
      content:
        'Theo quy định này, các nhà điều hành doanh nghiệp địa phương cần xây dựng dựng môi trường làm việc tràn ngập tiếng cười. Họ có trách nhiệm thúc đẩy nhân viên cười nhiều hơn mỗi ngày, Yomiuri đưa tin. Người dân sinh sống và làm việc tại Yamagata được khuyến khích cười mỉm, cười khúc khích hoặc cười thành tiếng hàng ngày. Ngày thứ 8 hàng tháng cũng được chỉ định là ngày “người dân hành động vì sức khỏe thông qua những tiếng cười”'
    }
  ]

  return (
    <>
      <div className='post'>
        {postItem.map((item, index) => {
          return (
            <>
              <div key={index} className='post__item'>
                <div className='post__item__infor'>
                  <div className='post__item__infor__avatar'>
                    <img src={item.avatar} alt='' />
                  </div>
                  <div className='post__item__infor__user-name'>{item.username}</div>
                </div>
                <div className='post__item__img'>
                  <img src={item.img} alt='' />
                </div>
                <div className='post__item__react'>
                  <div className='post__item__react__left'>
                    <span>
                      <FaRegHeart />
                    </span>
                    <span>
                      <FaRegComment />
                    </span>
                    <span>
                      <PiPaperPlaneTiltBold />
                    </span>
                  </div>
                  <div className='post__item__react__right'>
                    <FaRegBookmark />
                  </div>
                </div>
                <div className='post__item__like'>{item.like} Thích</div>
                <div className={more ? '' : 'post__item__content'}>{item.content}</div>
                <div
                  onClick={handleSeeMore}
                  style={{ fontSize: '20px', margin: '10px 0', color: '#ccd0d5', cursor: 'pointer' }}
                >
                  {more ? 'Rút gọn' : 'Xem thêm'}
                </div>
                <div
                  style={{ fontSize: '20px', margin: '10px 0', color: '#ccd0d5', cursor: 'pointer' }}
                  className='post__item__comments'
                >
                  Xem tất cả {item.comment} bình luận
                </div>
                <div className='post__item__add-comment'>
                  <input type='text' placeholder='Thêm bình luận...' />
                  <span className='post__item__add-comment__post-comment'>Đăng</span>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default Post
