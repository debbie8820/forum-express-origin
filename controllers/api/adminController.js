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
  },

  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    }, next)
  }
}

module.exports = adminController
