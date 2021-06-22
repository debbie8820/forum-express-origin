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
  }
}

module.exports = categoryController