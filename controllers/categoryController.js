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

  deleteCategory: (req, res, next) => { //注意要確定沒有餐廳使用該分類才能刪除，否則會出錯(ForeignKeyConstraintError)
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) {
          req.flash('err_msg', '查無此餐廳分類')
          return res.redirect('/admin/categories')
        }
        return category.destroy()
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController