const adminService = require('../../services/adminService')

const categoryController = {
  getCategories: (req, res, next) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    }, next)
  }
}


module.exports = categoryController