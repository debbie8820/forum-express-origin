const { Restaurant, Category } = require('../models')

const adminService = {
  getRestaurants: (req, res, cb, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category], //在restaurants中一併帶入關聯資料內容，可用this.Category取出
      order: [['id', 'DESC']]
    })
      .then((restaurants) => {
        if (restaurants.length) return cb({ restaurants })
        req.flash('err_msg', '目前無餐廳資料')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminService