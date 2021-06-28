const adminService = require('../../services/adminService')
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    }, next)
  }
}


module.exports = categoryController