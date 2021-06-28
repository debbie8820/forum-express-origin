const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')

router.get('/admin/restaurants', adminController.getRestaurants)

module.exports = router //將上面的變數router傳出去