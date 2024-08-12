import phones from '../../assets/home-phones.png'
import scren_1 from '../../assets/screenshot1.png'
import scren_2 from '../../assets/screenshot3.png'
import scren_3 from '../../assets/screenshot4.png'
import scren_4 from '../../assets/screenshot2.png'
import './forgotPassword.scss'
import { useState, useEffect } from 'react'
import { UserApi } from 'src/Service/User.api'
import { useMutation } from '@tanstack/react-query'
import { formForgotPasswordSchema } from 'src/Utils/FormSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

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

  type formForgotPasswordValues = z.infer<typeof formForgotPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formForgotPasswordValues>({
    resolver: zodResolver(formForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  interface forgotPasswordType {
    email: string
  }

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: forgotPasswordType) => {
      return UserApi.ForgotPassword(body)
    }
  })

  const handleForgotPassword = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        // toast.success(data.data.message)
        toast.success('Kiểm tra email của bạn để lấy lại mật khẩu !')
      },
      onError: (errors: any) => {
        toast.error(errors.response.data.message)
      }
    })
  })

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
        <form onSubmit={handleForgotPassword} className='forgotPassword__right__form'>
          <input {...register('email', { required: true })} type='text' placeholder='Email' />
          {errors.email ? <p>{errors.email.message}</p> : <p></p>}
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
