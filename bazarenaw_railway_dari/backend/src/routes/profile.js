const express = require('express')
const router = express.Router()
const Listing = require('../models/Listing')
const User = require('../models/User')
const auth = require('../middleware/auth')

router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password -verifyToken')
  res.json(user)
})

router.get('/me/listings', auth, async (req,res)=>{
  const items = await Listing.find({ owner: req.user.id })
  res.json(items)
})

module.exports = router
