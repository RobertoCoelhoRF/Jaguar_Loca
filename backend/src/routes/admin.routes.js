const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.post('/veiculos', adminController.createVeiculo)
router.get('/veiculos', adminController.listVeiculos)
router.get('/users', adminController.listUsers)
router.delete('/users/:id', adminController.deleteUser)

module.exports = router
