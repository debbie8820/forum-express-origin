const adminService = require('../services/adminService')
const { Restaurant, Category } = require('../models')
const imgur = require('imgur-node-api')

const imgurPromise = (filePath) => {
  return new Promise((resolve, reject) => {
    imgur.upload(filePath, (err, img) => {
      if (err) return reject(err)
      return resolve(img)
    })
  })
}

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    }, next)
  },

  createRestaurant: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        if (!categories.length) {
          req.flash('err_msg', '請先加入餐廳分類資料')
          return res.redirect('/admin/restaurants')
        }
        return res.render('admin/create', { categories })
      })
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('err_msg', data.message)
        return res.redirect('back')
      }
      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        return res.redirect('/admin/restaurants')
      }
    }, next)
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, (data) => { return res.render('admin/restaurant', data) }, next)
  },

  editRestaurant: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (!categories.length) {
          req.flash('err_msg', '請先加入餐廳分類資料')
          return res.redirect('/admin/restaurants')
        }
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            if (!restaurant) {
              req.flash('err_msg', '查無該餐廳資料')
              return res.redirect('/admin/restaurants')
            }
            return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
          })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('err_msg', data.message)
      } else {
        req.flash('success_msg', data.message)
      }
      return res.redirect('/admin/restaurants')
    }, next)
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_msg', '餐廳已成功移除')
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then((users) => {
        if (users.length) return res.render('admin/users', { users })
        req.flash('err_msg', '目前無使用者資料')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  },

  toggleAdmin: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          req.flash('err_msg', '查無該使用者資料')
          return res.redirect('/admin/users')
        }
        return user.update({ isAdmin: !(user.isAdmin) })
          .then(() => {
            req.flash('success_msg', '使用者權限已更改成功')
            return res.redirect('/admin/users')
          })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController