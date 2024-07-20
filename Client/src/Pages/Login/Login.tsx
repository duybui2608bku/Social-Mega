import phones from '../../assets/home-phones.png'
import scren_1 from '../../assets/screenshot1.png'
import scren_2 from '../../assets/screenshot3.png'
import scren_3 from '../../assets/screenshot4.png'
import scren_4 from '../../assets/screenshot2.png'
import { FcGoogle } from 'react-icons/fc'
import './Login.scss'
import { useState, useEffect } from 'react'

const Login = () => {
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
    <div className='login'>
      <div className='login__left'>
        <img src={phones} alt='phones' />
        <img className='login__left__scren' src={images[randomImage]} alt={`scren_${randomImage}`} />
      </div>
      <div className='login__right'>
        <h3>SOCIAL MEGA</h3>
        <form className='login__right__form'>
          <input type='text' placeholder='Email' />
          <input type='password' placeholder='Mật Khẩu' />
          <button className='login__right__form__btn'>Đăng Nhập</button>
        </form>
        <div style={{ textAlign: 'center', margin: '15px 0', fontSize: '17px' }}>HOẶC</div>
        <div className='login__right__login-gogle'>
          <FcGoogle />
          <span>Đăng nhập với Google</span>
        </div>
        <div className='login__right__sign-up'>
          <p>
            Không có tài khoản? <a href='/register'>Đăng kí ngay</a>
          </p>
        </div>
        <a href='forgot-password' className='login__right__forgot-password'>
          Quên mật khẩu
        </a>
      </div>
    </div>
  )
}

export default Login
