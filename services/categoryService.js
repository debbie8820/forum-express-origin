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
  },

  putCategory: (req, res, cb, next) => {
    if (!req.body.name) return cb({ status: 'error', message: '請填寫欄位' })
    return Category.findByPk(req.params.id)
      .then((category) => {
        if (!category) return cb({ status: 'error', message: '查無此餐廳分類' })
        return category.update({ name: req.body.name })
          .then(() => { return cb({ status: 'success', message: '類別更新成功' }) })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },

  deleteCategory: (req, res, cb, next) => { //注意要確定沒有餐廳使用該分類才能刪除，否則會出錯(ForeignKeyConstraintError)
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) return cb({ status: 'error', message: '查無此餐廳分類' })
        return category.destroy()
          .then(() => { return cb({ status: 'success', message: '類別已成功刪除' }) })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = categoryService