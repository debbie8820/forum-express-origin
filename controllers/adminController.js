const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category], //在restaurants中一併帶入關聯資料內容，可用this.Category取出
      order: [['id', 'DESC']]
    })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch(err => { return res.status(422).json(err) })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then((categories) => { return res.render('admin/create', { categories }) })
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        req.body.image = file ? img.data.link : null
        return Restaurant.create(req.body)
          .then(() => {
            req.flash('success_msg', '餐廳已建立成功')
            return res.redirect('/admin/restaurants')
          })
          .catch(err => { return res.status(422).json(err) })
      })
    }
    else {
      req.body.image = null
      return Restaurant.create(req.body)
        .then(() => {
          req.flash('success_msg', '餐廳已建立成功')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => { return res.status(422).json(err) })
    }
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then((restaurant) => { return res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) })
      .catch(err => { return res.status(422).json(err) })
  },

  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => { return res.render('admin/create', { restaurant: restaurant.toJSON(), categories }) })
      })
      .catch(err => { return res.status(422).json(err) })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填入餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            req.body.image = file ? img.data.link : null
            restaurant.update(req.body)
          })
          .then(() => {
            req.flash('success_msg', '資料更新成功')
            return res.redirect('/admin/restaurants')
          })
          .catch(err => res.status(422).json(err))
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => restaurant.update(req.body))
        .then(() => {
          req.flash('success_msg', '資料更新成功')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => res.status(422).json(err))
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.destroy())
      .then(() => {
        req.flash('success_msg', '餐廳已成功移除')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => res.status(422).json(err))
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then((users) => res.render('admin/users', { users }))
      .catch(err => res.status(422).json(err))
  },

  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        user.update({ isAdmin: !(user.isAdmin) })
          .then(() => {
            req.flash('success_msg', '使用者權限已更改成功')
            return res.redirect('/admin/users')
          })
      })
      .catch(err => res.status(422).json(err))
  }
}
module.exports = adminController