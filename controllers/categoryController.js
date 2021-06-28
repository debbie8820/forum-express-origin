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
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    Category.findAll({ where: { name: req.body.name } })
      .then((category) => {
        if (category.length) {
          req.flash('err_msg', '此類別已存在')
          return res.redirect('back')
        }
        return Category.create(req.body)
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then((category) => {
        if (!category) {
          req.flash('err_msg', '查無此餐廳分類')
          return res.redirect('/admin/categories')
        }
        return category.update(req.body)
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
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