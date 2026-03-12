const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const multer = require('multer')
const path = require('path')

const uploadsDir = path.resolve(__dirname, '../../uploads')
const storage = multer.diskStorage({
	destination: function (req, file, cb) { cb(null, uploadsDir) },
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
		cb(null, `${unique}-${safe}`)
	}
})

function fileFilter (req, file, cb) {
	if (!file.mimetype.startsWith('image/')) return cb(new Error('Tipo de arquivo inválido'), false)
	cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

// Accept multipart/form-data with optional `foto` file
router.post('/veiculos', upload.single('foto'), adminController.createVeiculo)
router.put('/veiculos/:id', upload.single('foto'), adminController.updateVeiculo)
router.get('/veiculos', adminController.listVeiculos)
router.get('/users', adminController.listUsers)
router.delete('/users/:id', adminController.deleteUser)
router.delete('/veiculos/:id', adminController.deleteVeiculo)
router.get('/reservas', adminController.listReservas)
router.delete('/reservas/:id', adminController.deleteReserva)

module.exports = router
