const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then((categories) => {
        if (categories.length) { return res.render('admin/categories', { categories }) }
        req.flash('err_msg', '目前無任何餐廳分類')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    console.log('1', req.body.name)
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    Category.findAll({ where: { name: req.body.name } })
      .then((category) => {
        if (category.length) {
          console.log('2', category)
          req.flash('err_msg', '此類別已存在')
          return res.redirect('back')
        }
        return Category.create(req.body)
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController