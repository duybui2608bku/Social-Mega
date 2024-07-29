import phones from '../../assets/home-phones.png'
import scren_1 from '../../assets/screenshot1.png'
import scren_2 from '../../assets/screenshot3.png'
import scren_3 from '../../assets/screenshot4.png'
import scren_4 from '../../assets/screenshot2.png'
import { FcGoogle } from 'react-icons/fc'
import './Login.scss'
import { useState, useEffect, useContext } from 'react'
import { formLoginSchema } from 'src/Utils/FormSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { UserApi } from 'src/Service/User.api'
import { toast } from 'react-toastify'
import { isAxiousUnprocessableEntity } from 'src/Utils/Utils'
import { AppContext } from 'src/Context/App.context'
import { useNavigate } from 'react-router'

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

  const { setIsAuthenticated } = useContext(AppContext)
  const nagivate = useNavigate()

  type formLoginValues = z.infer<typeof formLoginSchema>

  interface loginType {
    email: string
    password: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutaion = useMutation({
    mutationFn: (body: loginType) => {
      return UserApi.Login(body)
    }
  })

  const handleLogin = handleSubmit((data) => {
    loginMutaion.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        toast.success(data.data.message)
        toast.success('Đăng nhập thành công')
        nagivate('/')
      },
      onError: (errors: any) => {
        if (isAxiousUnprocessableEntity(errors)) {
          toast.error(errors.response?.data.errors.email.msg)
        }
      }
    })
  })

  return (
    <div className='login'>
      <div className='login__left'>
        <img src={phones} alt='phones' />
        <img className='login__left__scren' src={images[randomImage]} alt={`scren_${randomImage}`} />
      </div>
      <div className='login__right'>
        <h3>SOCIAL MEGA</h3>
        <form onSubmit={handleLogin} className='login__right__form'>
          <input {...register('email', { required: true })} type='text' placeholder='Email' />
          {errors.email ? <p>{errors.email.message}</p> : <p></p>}
          <input {...register('password', { required: true })} type='password' placeholder='Mật Khẩu' />
          {errors.password ? <p>{errors.password.message}</p> : <p></p>}
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
