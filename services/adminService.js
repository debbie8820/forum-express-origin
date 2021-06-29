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

  postRestaurant: (req, res, cb, next) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: '請填寫餐廳名稱' })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgurPromise(file.path)
        .then(img => {
          req.body.image = file ? img.data.link : null
          return Restaurant.create(req.body)
            .then(() => {
              return cb({ status: 'success', message: '餐廳已建立成功' })
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    }
    else {
      req.body.image = null
      return Restaurant.create(req.body)
        .then(() => {
          return cb({ status: 'success', message: '餐廳已建立成功' })
        })
        .catch(err => next(err))
    }
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