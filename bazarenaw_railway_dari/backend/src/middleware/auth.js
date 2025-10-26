const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'change_this_secret'

function auth(req,res,next){
  const h = req.headers.authorization
  if(!h) return res.status(401).json({ error: 'توکن وجود ندارد' })
  const token = h.split(' ')[1]
  try {
    const data = jwt.verify(token, secret)
    req.user = data
    next()
  } catch(e){
    res.status(401).json({ error: 'توکن نامعتبر است' })
  }
}

module.exports = auth
