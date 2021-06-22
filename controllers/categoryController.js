const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then((categories) => {
        if (categories) { return res.render('admin/categories', { categories }) }
        req.flash('err_msg', '目前無任何餐廳分類')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    return Category.create(req.body)
      .then(() => { return res.redirect('/admin/categories') })
      .catch(err => next(err))
  }
}

module.exports = categoryController