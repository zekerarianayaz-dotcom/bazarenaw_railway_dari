const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listings')
const profileRoutes = require('./routes/profile')

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const limiter = rateLimit({ windowMs: 60*1000, max: 120 })
app.use(limiter)

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/bazarenaw'

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('اتصال به MongoDB برقرار شد'))
  .catch(err => console.error('خطای MongoDB', err))

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/users', profileRoutes)

app.get('/api/health', (req,res)=> res.json({ ok: true }))

app.listen(PORT, ()=> console.log('سرور روی پورت', PORT, 'در حال اجراست'))
