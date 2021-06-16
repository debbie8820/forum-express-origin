const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch(err => { return res.status(422).json(err) })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    return Restaurant.create(req.body)
      .then(() => {
        req.flash('success_msg', '餐廳已建立成功')
        res.redirect('/admin/restaurants')
      })
      .catch(err => { return res.status(422).json(err) })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => { return res.render('admin/restaurant', { restaurant }) })
      .catch(err => { return res.status(422).json(err) })
  }

}
module.exports = adminController