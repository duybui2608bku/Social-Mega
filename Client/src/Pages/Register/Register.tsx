import phones from '../../assets/home-phones.png'
import scren_1 from '../../assets/screenshot1.png'
import scren_2 from '../../assets/screenshot3.png'
import scren_3 from '../../assets/screenshot4.png'
import scren_4 from '../../assets/screenshot2.png'
import { FcGoogle } from 'react-icons/fc'
import './Register.scss'
import { useState, useEffect } from 'react'
import { formRegisterSchema } from 'src/Utils/FormSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
const Register = () => {
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

  type formRegisterValues = z.infer<typeof formRegisterSchema>

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<formRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      date_of_birth: '',
      username: ''
    }
  })

  return (
    <div className='register'>
      <div className='register__left'>
        <img src={phones} alt='phones' />
        <img className='register__left__scren' src={images[randomImage]} alt={`scren_${randomImage}`} />
      </div>
      <div className='register__right'>
        <h3>SOCIAL MEGA</h3>
        <form className='register__right__form'>
          <input {...(register('email'), { required: true })} type='text' placeholder='Email' />
          <input {...(register('password'), { required: true })} type='password' placeholder='Mật Khẩu' />
          <input
            {...(register('confirmPassword'), { required: true })}
            type='password'
            placeholder='Xác Nhận Mật Khẩu'
          />
          <input {...(register('username'), { required: true })} type='text' placeholder='Tên người dùng' />
          <button className='register__right__form__btn'>Đăng Kí</button>
        </form>
        <div style={{ textAlign: 'center', margin: '15px 0', fontSize: '17px' }}>HOẶC</div>
        <div className='register__right__register-gogle'>
          <FcGoogle />
          <span>Đăng nhập với Google</span>
        </div>
        <div className='register__right__sign-up'>
          <p>
            Đã có tài khoản? <a href='/login'>Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
