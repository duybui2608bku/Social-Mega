import { hasSpecialCharacter, hasUpperCase, iso8601Regex } from 'src/Utils/regex'
import { z } from 'zod'
export const formRegisterSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng !' }),
  password: z
    .string()
    .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
    .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
    .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
      message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
    }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Mật Khẩu phải ít nhất 6 kí tự !' })
    .max(50, { message: 'Mật khẩu phải ít hơn 50 kí tự !' })
    .refine((value) => hasUpperCase.test(value) && hasSpecialCharacter.test(value), {
      message: 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa và 1 kí tự đặc biệt !'
    }),
  username: z
    .string()
    .min(1, { message: 'Tên người dùng không được để trống !' })
    .max(255, { message: 'Tên người dùng không được quá 255 kí tự !' }),
  date_of_birth: z.string().regex(iso8601Regex, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD !' })
})
