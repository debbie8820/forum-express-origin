const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => {
        if (!restaurants.length) {
          req.flash('err_msg', '目前無餐廳資料')
          return res.render('restaurants')
        }
        const data = restaurants.map(r => ({
          ...r.dataValues, //...r的寫法把餐廳陣列拆成一個個物件
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) {
          req.flash('err_msg', '無該餐廳的資料')
          res.redirect('back')
        }
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = restController