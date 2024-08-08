import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.APP_PASSWORD
  }
})

const sendMail = async ({ email, html }: { email: string; html: string }) => {
  await transporter.sendMail({
    from: '"SOCIAL MEGAKOREA" <no-reply@example.com>',
    to: email,
    subject: 'XÁC THỰC TÀI KHOẢN',
    html: html
  })
}

export default sendMail
