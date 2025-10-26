const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: (process.env.SMTP_SECURE === 'true'),
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
})

async function sendVerification(email, link){
  if(!transporter) return
  const from = process.env.SMTP_FROM || 'نوتیفیکیشن <noreply@example.com>'
  const text = `لطفاً برای راستی‌آزمایی حساب خود روی این لینک کلیک کنید:\n${link}\n\nاگر شما این درخواست را ارسال نکرده‌اید، این ایمیل را نادیده بگیرید.`
  await transporter.sendMail({ from, to: email, subject: 'تایید حساب Bazarenaw', text })
}

module.exports = { sendVerification }
