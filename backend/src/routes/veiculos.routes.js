const express = require('express')
const router = express.Router()
const adminService = require('../services/admin.service')

router.get('/', async (req, res) => {
  try {
    const veiculos = await adminService.listVeiculos()
    res.json({ veiculos })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
