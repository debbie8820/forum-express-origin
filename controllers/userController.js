const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const Sequelize = require('sequelize')

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
    User.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        if (!user) {
          req.flash('err_msg', '查無此使用者資料')
          return res.redirect('/restaurants')
        }

        return Comment.findAll({ //從Comment找出已評論餐廳(排除重複餐廳)
          raw: true,
          nest: true,
          include: [Restaurant],
          where: { UserId: req.params.id },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('RestaurantId')), 'RestaurantId']
          ]
        })
          .then((comments) => { //設定User為頁面擁有者(和req.user登入者區分)
            res.render('user', { User: user.toJSON(), comments })
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
          .then(() => { return res.redirect('back') })
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
  },

  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then((users) => {
        if (!users.length) {
          req.flash('err_msg', '目前無使用者')
          return res.redirect('/users/top')
        }
        users = users.map(user => ({
          ...user.dataValues,
          totalFollower: user.Followers.length,
          isFollowed: user.Followers.map((d => d.id)).includes(req.user.id)
        }))
        users.sort((a, b) => b.totalFollower - a.totalFollower)
        return res.render('topUsers', { users })
      })
      .catch(err => next(err))
  },

  addFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((result) => {
        if (result) {
          req.flash('err_msg', '已在追蹤此使用者')
          return res.redirect('/users/top')
        }
        return Followship.create({
          followerId: req.user.id,
          followingId: req.params.userId
        })
          .then(() => { return res.redirect('back') })
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((result) => {
        if (!result) {
          req.flash('err_msg', '您未追蹤此使用者')
          return res.redirect('/users/top')
        }
        return result.destroy()
          .then(() => { return res.redirect('back') })
      })
      .catch(err => next(err))
  }
}

module.exports = userController