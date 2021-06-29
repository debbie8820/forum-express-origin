const adminService = require('../../services/adminService')
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    }, next)
  },

  deleteCategory: (req, res, next) => {
    categoryService.deleteCategory(req, res, (data) => {
      return res.json(data)
    }, next)
  }
}


module.exports = categoryController