import phones from '../../assets/home-phones.png'
import scren_1 from '../../assets/screenshot1.png'
import scren_2 from '../../assets/screenshot3.png'
import scren_3 from '../../assets/screenshot4.png'
import scren_4 from '../../assets/screenshot2.png'
import './forgotPassword.scss'
import { useState, useEffect } from 'react'

const ForgotPassword = () => {
  const images = [scren_1, scren_2, scren_3, scren_4]
  const [randomImage, setRandomImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomImage((prevRandomImage) => (prevRandomImage + 1) % images.length)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [images.length])

  return (
    <div className='forgotPassword'>
      <div className='forgotPassword__left'>
        <img src={phones} alt='phones' />
        <img className='forgotPassword__left__scren' src={images[randomImage]} alt={`scren_${randomImage}`} />
      </div>
      <div className='forgotPassword__right'>
        <h3>SOCIAL MEGA</h3>
        <div style={{ textAlign: 'center', margin: '15px 0', fontSize: '17px' }}>Bạn không thể đăng nhập ?</div>
        <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '17px' }}>
          Nhập email của bạn để nhận đường dẫn lấy lại mật khẩu của bạn
        </div>
        <div></div>
        <form className='forgotPassword__right__form'>
          <input type='text' placeholder='Email' />
          <button className='forgotPassword__right__form__btn'>Gửi link đăng nhập</button>
        </form>
        <div style={{ textAlign: 'center', margin: '15px 0', fontSize: '17px' }}>HOẶC</div>

        <div className='forgotPassword__right__sign-up'>
          <a href='/register'>Đăng kí ngay</a>
        </div>
        <a href='/login' className='forgotPassword__right__btn-login'>
          Quay trở lại đăng nhập
        </a>
      </div>
    </div>
  )
}

export default ForgotPassword
