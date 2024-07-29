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
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DateSelected from 'src/Components/DateSelected/DateSelected'
import { useMutation } from '@tanstack/react-query'
import { UserApi } from 'src/Service/User.api'
import { omit } from 'lodash'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

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

  interface registerType {
    email: string
    password: string
    confirm_password: string
    name: string
    date_of_birth: Date
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<formRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      date_of_birth: new Date(1990, 1, 1),
      name: ''
    }
  })

  const registerMutaion = useMutation({
    mutationFn: (body: registerType) => {
      return UserApi.Register(body)
    }
  })

  const handleRegister = handleSubmit((data) => {
    registerMutaion.mutate(data, {
      onSuccess: (_) => {
        toast.success('Đăng kí thành công')
      },
      onError: (error: any) => {
        const errorMess: AxiosError = error
        toast.error((errorMess.response?.data as AxiosError)?.message)
      }
    })
  })
  console.log(errors)

  return (
    <div className='register'>
      <div className='register__left'>
        <img src={phones} alt='phones' />
        <img className='register__left__scren' src={images[randomImage]} alt={`scren_${randomImage}`} />
      </div>
      <div className='register__right'>
        <h3>SOCIAL MEGA</h3>
        <form onSubmit={handleRegister} className='register__right__form'>
          <div className='register__right__form__input'>
            <div>
              <input {...register('email', { required: true })} type='text' placeholder='Email' />
              {errors.email ? <p>{errors.email.message}</p> : <p></p>}
            </div>
            <div>
              <input {...register('name', { required: true })} type='text' placeholder='Tên người dùng' />
              {errors.name ? <p>{errors.name.message}</p> : <p></p>}
            </div>
          </div>
          <div className='register__right__form__input'>
            <div>
              <input {...register('password', { required: true })} type='password' placeholder='Mật Khẩu' />
              {errors.password ? <p>{errors.password.message}</p> : <p></p>}
            </div>
            <div>
              <input
                {...register('confirm_password', { required: true })}
                type='password'
                placeholder='Xác Nhận Mật Khẩu'
              />
              {errors.confirm_password ? <p>{errors.confirm_password.message}</p> : <p></p>}
            </div>
          </div>
          <Controller
            name='date_of_birth'
            control={control}
            render={({ field }) => <DateSelected onChange={field.onChange} value={field.value} />}
          />
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
