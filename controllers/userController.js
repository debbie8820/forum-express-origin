const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('err_msg', '密碼與確認密碼不符')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          req.flash('err_msg', '此信箱已註冊')
          return res.redirect('/signup')
        }
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        return User
          .create({ name, email, password: hashPassword })
          .then(() => {
            req.flash('success_msg', '你已成功註冊')
            res.redirect('/signin')
          })
      })
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.logout()
    req.flash('success_msg', '成功登出')
    return res.redirect('/signin')
  },

  getUser: (req, res, next) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          req.flash('err_msg', '查無此使用者資料')
          return res.redirect('/restaurants')
        }
        Comment.findAndCountAll({ raw: true, nest: true, include: [Restaurant], where: { UserId: req.params.id } })
          .then(result => {
            return res.render('user', { User: user.toJSON(), totalComments: result.count, comments: result.rows })
          })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          req.flash('err_msg', '查無此使用者資料')
          return res.redirect('/restaurants')
        }
        return res.render('userEdit', { User: user.toJSON() })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫使用者名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        req.body.image = file ? img.data.link : null
        return User.findByPk(req.params.id)
          .then((user) => {
            if (!user) {
              req.flash('err_msg', '查無此使用者資料')
              return res.redirect('back')
            }
            return user.update(req.body)
              .then(() => {
                req.flash('success_msg', '資料已成功更新')
                return res.redirect(`/users/${req.params.id}`)
              })
          })
          .catch(err => next(err))
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          if (!user) {
            req.flash('err_msg', '查無此使用者資料')
            return res.redirect('back')
          }
          return user.update(req.body)
            .then(() => {
              req.flash('success_msg', '資料已成功更新')
              return res.redirect(`/users/${req.params.id}`)
            })
        })
        .catch(err => next(err))
    }
  },

  addFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((result) => {
        if (result) {
          req.flash('err_msg', '此餐廳已加入最愛')
          return res.redirect('/restaurants')
        }
        return Favorite.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
          .then(() => { return res.redirect('back') })
      })
      .catch(err => next(err))
  },

  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        if (!favorite) {
          req.flash('err_msg', '使用者目前無收藏此餐廳')
          return res.redirect('/restaurants')
        }
        return favorite.destroy()
          .then(() => { return res.redirect('/restaurants') })
      })
      .catch(err => next(err))
  },

  likeRestaurant: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((result) => {
        if (result) {
          req.flash('err_msg', '已為此餐廳按讚')
          return res.redirect('/restaurants')
        }
        return Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
          .then(() => { return res.redirect('back') })
      })
      .catch(err => next(err))
  },

  unlikeRestaurant: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((result) => {
        if (!result) {
          req.flash('err_msg', '您並未按讚此餐廳')
          return res.redirect('/restaurants')
        }
        return result.destroy()
          .then(() => { return res.redirect('back') })
      })
      .catch(err => next(err))
  }
}

module.exports = userController