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
  },

  getRestaurant: (req, res, cb, next) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then((restaurant) => {
        if (!restaurant) {
          req.flash('err_msg', '查無該餐廳資料')
          return res.redirect('/admin/restaurants')
        }
        return cb({ restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, cb, next) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        if (!restaurant) {
          req.flash('err_msg', '查無該餐廳資料')
          return res.redirect('/admin/restaurants')
        }
        return restaurant.destroy()
          .then(() => {
            return cb({ status: 'success', message: '' })
          })
      })
      .catch(err => next(err))
  },
}

module.exports = adminService