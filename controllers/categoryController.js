const { Category } = require('../models')
const adminService = require('../services/adminService')
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    }, next)
  },

  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('err_msg', data.message)
      } else {
        req.flash('success_msg', data.message)
      }
      return res.redirect('/admin/categories')
    }, next)
  },

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('err_msg', data.message)
      } else {
        req.flash('success_msg', data.message)
      }
      return res.redirect('/admin/categories')
    }, next)
  },

  deleteCategory: (req, res, next) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('err_msg', data.message)
      } else {
        req.flash('success_msg', data.message)
      }
      return res.redirect('/admin/categories')
    }, next)
  }
}

module.exports = categoryController