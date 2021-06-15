const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('err_msg', '密碼與確認密碼不符')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email } }).then((user) => {
      if (user) {
        req.flash('err_msg', '此信箱已註冊')
        return res.redirect('/signup')
      }
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      return User
        .create({ name, email, password: hashPassword })
        .then(() => res.redirect('/signin'))
    })
  }
}

module.exports = userController