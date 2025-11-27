const express = require('express')
const router = express.Router()
const adminService = require('../services/admin.service')

router.get('/', async (req, res) => {
  try {
    const vehicles = await adminService.listVehicles()
    res.json({ veiculos: vehicles })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
