const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true })
      .then((categories) => {
        if (categories) { return res.render('admin/categories', { categories }) }
        req.flash('err_msg', '目前無任何餐廳分類')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => console.log(err))
  }
}

module.exports = categoryController