const { Restaurant, Category } = require('../models')

const categoryService = {
  getCategories: (req, res, cb, next) => {
    return Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then((category) => {
              if (!category) {
                req.flash('err_msg', '查無此餐廳分類')
                return res.redirect('/admin/categories')
              }
              return cb({ categories, category: category.toJSON() })
            })
        } else {
          return cb({ categories })
        }
      })
      .catch(err => next(err))
  }
}

module.exports = categoryService