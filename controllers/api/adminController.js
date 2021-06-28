const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    }, next)
  }
}

module.exports = adminController
