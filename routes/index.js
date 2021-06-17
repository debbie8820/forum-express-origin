const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    return res.redirect('/signin')
  }

  const authenticatedForAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) return next()
      return res.redirect('/')
    }
    return res.redirect('/signin')
  }


  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', authenticatedForAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedForAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedForAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedForAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedForAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedForAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedForAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedForAdmin, adminController.deleteRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
}
