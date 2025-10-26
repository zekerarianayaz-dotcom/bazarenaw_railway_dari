const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const crypto = require('crypto')
const { sendVerification } = require('../utils/email')

const secret = process.env.JWT_SECRET || 'change_this_secret'
const baseUrl = process.env.BASE_URL || ''

router.post('/register', [
  body('username').isLength({ min:3 }).trim().escape(),
  body('password').isLength({ min:6 }),
  body('email').optional().isEmail().normalizeEmail()
], async (req,res)=>{
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { username, password, email } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const verifyToken = crypto.randomBytes(20).toString('hex')
  try {
    const user = await User.create({ username, password: hashed, email, verifyToken })
    if(email && process.env.SMTP_USER){
      const link = `${baseUrl}/api/auth/verify/${verifyToken}`
      await sendVerification(email, link)
    }
    res.json({ ok:true, id: user._id, message: 'راجستر شدن موفقانه. لطفاً ایمیل خود را برای تایید بررسی کنید.' })
  } catch(e){
    res.status(400).json({ error: 'نام کاربری وجود دارد' })
  }
})

router.get('/verify/:token', async (req,res)=>{
  const { token } = req.params
  const user = await User.findOne({ verifyToken: token })
  if(!user) return res.status(400).send('توکن نامعتبر')
  user.verified = true; user.verifyToken = undefined; await user.save()
  res.send('اکانت شما تائید شد')
})

router.post('/login', [
  body('username').trim().escape(),
  body('password').exists()
], async (req,res)=>{
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if(!user) return res.status(400).json({ error: 'نام کاربری یا رمز عبور نادرست است' })
  const match = await bcrypt.compare(password, user.password)
  if(!match) return res.status(400).json({ error: 'نام کاربری یا رمز عبور نادرست است' })
  if(!user.verified) return res.status(403).json({ error: 'ایمیل تایید نشده است' })
  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
})

module.exports = router
