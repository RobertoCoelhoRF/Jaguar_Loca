const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const multer = require('multer')
const path = require('path')

// setup multer to save uploads into backend/uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(__dirname, '../../uploads'))
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, `${unique}${ext}`)
	}
})
const upload = multer({ storage })

// upload image optional
router.post('/veiculos', upload.single('image'), adminController.createVehicle)
router.get('/users', adminController.listUsers)
router.delete('/users/:id', adminController.deleteUser)

module.exports = router
