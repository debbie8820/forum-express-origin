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
  },

  postCategory: (req, res, cb, next) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: '請填寫欄位' })
    }
    Category.findAll({ where: { name: req.body.name } })
      .then((category) => {
        if (category.length) {
          return cb({ status: 'error', message: '此類別已存在' })
        }
        return Category.create(req.body)
          .then(() => { return cb({ status: 'success', message: '類別建立成功' }) })
      })
      .catch(err => next(err))
  }
}

module.exports = categoryService