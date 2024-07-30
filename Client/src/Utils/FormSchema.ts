import { hasSpecialCharacter, hasUpperCase, numberRegex } from 'src/Utils/regex'
import { z } from 'zod'
export const formRegisterSchema = z
  .object({
    email: z.string().email({ message: 'Email không đúng định dạng !' }),
    password: z
      .string()
      .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
      .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
      .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
      }),
    confirm_password: z
      .string()
      .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
      .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
      .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
      }),
    name: z
      .string({ message: 'Tên người dùng không đúng định dạng !' })
      .min(1, { message: 'Tên người dùng không được để trống !' })
      .max(255, { message: 'Tên người dùng không được quá 255 kí tự !' })
      .refine((value) => !numberRegex.test(value), { message: 'Không được chứa chữ số !' }),
    date_of_birth: z.date({ message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD !' })
  })
  .strict()
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không trùng khớp !',
        path: ['confirm_password']
      })
    }
  })

export const formLoginSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng !' }),
  password: z
    .string()
    .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
    .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
    .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
      message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
    })
})

export const formForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng !' })
})

export const formChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
      .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
      .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
      }),
    old_password: z
      .string()
      .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
      .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
      .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
      }),
    confirm_password: z
      .string()
      .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
      .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
      .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
      })
  })
  .strict()
  .superRefine(({ password, old_password, confirm_password }, ctx) => {
    if (password === old_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới trùng với mật khẩu cũ!',
        path: ['password']
      })
    }
    if (password !== confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không trùng khớp !',
        path: ['confirm_password']
      })
    }
  })
