const express = require('express')
const router = express.Router()
const Listing = require('../models/Listing')
const auth = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: '/tmp/uploads/', limits: { fileSize: 3 * 1024 * 1024 } })
const { body, validationResult } = require('express-validator')

router.get('/', async (req,res)=>{
  const items = await Listing.find({ approved: true }).populate('owner', 'username')
  res.json(items)
})

router.post('/', auth, upload.single('image'), [
  body('title').isLength({ min:3 }).trim().escape(),
  body('description').isLength({ min:10 }).trim().escape()
], async (req,res)=>{
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { title, description, price, location, category } = req.body
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
  const listing = await Listing.create({ title, description, price, location, category, imageUrl, owner: req.user.id, approved: false })
  res.json({ ok:true, id: listing._id, message: 'آگهی شما ثبت شد و منتظر تایید است' })
})

router.put('/:id', auth, [
  body('title').optional().isLength({ min:3 }).trim().escape(),
  body('description').optional().isLength({ min:10 }).trim().escape()
], async (req,res)=>{
  const item = await Listing.findById(req.params.id)
  if(!item) return res.status(404).json({ error: 'پیدا نشد' })
  if(item.owner.toString() !== req.user.id) return res.status(403).json({ error: 'شما مالک این آگهی نیستید' })
  Object.assign(item, req.body)
  item.approved = false
  await item.save()
  res.json({ ok:true, message: 'آگهی ویرایش شد و منتظر تایید است' })
})

router.delete('/:id', auth, async (req,res)=>{
  const item = await Listing.findById(req.params.id)
  if(!item) return res.status(404).json({ error: 'پیدا نشد' })
  if(item.owner.toString() !== req.user.id && req.user.role !== 'moderator') return res.status(403).json({ error: 'دسترسی ندارید' })
  await item.remove()
  res.json({ ok:true, message: 'آگهی حذف شد' })
})

module.exports = router
