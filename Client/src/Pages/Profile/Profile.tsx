import { useState } from 'react'
import './Profile.scss'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import { formChangePasswordSchema } from 'src/Utils/FormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { UserApi } from 'src/Service/User.api'
import { toast } from 'react-toastify'
const Profile = () => {
  const [open, setOpen] = useState(false)

  type formChangePasswordValues = z.infer<typeof formChangePasswordSchema>

  interface changePasswordType {
    password: string
    old_password: string
    confirm_password: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<formChangePasswordValues>({
    resolver: zodResolver(formChangePasswordSchema),
    defaultValues: {
      password: '',
      old_password: ''
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: (body: changePasswordType) => {
      return UserApi.ChangePassword(body)
    }
  })

  const handleChangePassword = handleSubmit((data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (_) => {
        // toast.success(data.data.message)
        toast.success('Đổi mật khẩu thành công')
      },
      onError: (errors: any) => {
        toast.error(errors.response.data.message)
      }
    })
  })

  return (
    <>
      <button onClick={() => setOpen(!open)}>Change Password</button>
      <div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className='dialogOverlay-forgotpassword' />
            <Dialog.Content className='dialogContent-forgotpassword'>
              <Dialog.Title className='dialogTitle-forgotpassword'>Đổi mật khẩu</Dialog.Title>
              <Dialog.Description>
                <form onSubmit={handleChangePassword} className='dialogForm-forgotpassword'>
                  <input {...register('old_password', { required: true })} type='password' placeholder='Mật khẩu cũ' />
                  {errors.password ? <p>{errors.password.message}</p> : <p></p>}
                  <input {...register('password', { required: true })} type='password' placeholder='Mật khẩu mới' />
                  {errors.password ? <p>{errors.old_password?.message}</p> : <p></p>}
                  <input
                    {...register('confirm_password', { required: true })}
                    type='password'
                    placeholder='Mật khẩu mới'
                  />
                  {errors.password ? <p>{errors.old_password?.message}</p> : <p></p>}
                  <button type='submit' className='dialogForm-forgotpassword__btn-submit'>
                    Đổi mật khẩu
                  </button>
                </form>
              </Dialog.Description>
              <button className='btn-close-dialog-forgotpassword' onClick={() => setOpen(false)}>
                Đóng
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  )
}
export default Profile
