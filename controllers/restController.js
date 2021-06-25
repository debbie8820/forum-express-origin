const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const pageLimit = 10

const restController = {
  getRestaurants: (req, res, next) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      .then(result => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 > 1 ? page - 1 : 1
        const next = page + 1 < pages ? page + 1 : pages

        if (!result.rows.length) {
          req.flash('err_msg', '目前無餐廳資料')
          return res.render('restaurants')
        }

        const data = result.rows.map(r => ({
          ...r.dataValues, //...r的寫法把餐廳陣列拆成一個個物件
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.dataValues.Category.name
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            if (!categories.length) {
              req.flash('err_msg', '目前無分類資料')
              return res.redirect('/')
            }
            return res.render('restaurants', { restaurants: data, categories, categoryId, page: page, totalPage: totalPage, prev: prev, next: next })
          })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: [User] }] //一併取出關聯資料
    })
      .then(restaurant => {
        if (!restaurant) {
          req.flash('err_msg', '查無此餐廳資料')
          res.redirect('back')
        }
        return restaurant.increment('viewCounts')
          .then((restaurant) => {
            return res.render('restaurant', { restaurant: restaurant.toJSON() })
          })
      })
      .catch(err => next(err))
  },

  getFeeds: (req, res, next) => {
    return Promise.all //比起先找出餐廳資料再用.then找出評論會更省時(能同步進行，不用等待)
      ([
        Restaurant.findAll({
          raw: true,
          nest: true,
          limit: 10,
          include: [Category],
          order: [['createdAt', 'DESC']]
        }),

        Comment.findAll({
          raw: true,
          nest: true,
          limit: 10,
          include: [User, Restaurant],
          order: [['createdAt', 'DESC']]
        })
      ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { include: [Category, Comment] })
      .then(restaurant => {
        if (!restaurant) {
          req.flash('err_msg', '無該餐廳的資料')
          res.redirect('back')
        }
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = restController