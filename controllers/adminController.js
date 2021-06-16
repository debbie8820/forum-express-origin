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
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => { return res.render('admin/create', { restaurant }) })
      .catch(err => { return res.status(422).json(err) })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填入餐廳名稱')
      return res.redirect('back')
    }
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.update(req.body))
      .then(() => {
        req.flash('success_msg', '資料更新成功')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => res.status(422).json(err))
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.destroy())
      .then(() => {
        req.flash('success_msg', '餐廳已成功移除')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => res.status(422).json(err))
  }

}
module.exports = adminController