const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.APP_PASSWORD
  }
})

const sendMail = asyncHandler(async ({ email, html }: { email: unknown; html: unknown }) => {
  await transporter.sendMail({
    from: '"SOCIAL MEGAKOREA" <no-reply@example.com>',
    to: email,
    subject: 'XÁC THỰC TÀI KHOẢN',
    html: html
  })
})

export default sendMail
