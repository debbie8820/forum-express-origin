const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const helpers = require('../_helpers')

const express = require('express')
const router = express.Router()
const passport = require('../config/passport')


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  return res.redirect('/signin')
}

const authenticatedForAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

//Restaurant
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedForAdmin, commentController.deleteComment)

//Admin
router.get('/admin', authenticatedForAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedForAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedForAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedForAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedForAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedForAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedForAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedForAdmin, adminController.deleteRestaurant)

//User
router.get('/admin/users', authenticatedForAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedForAdmin, adminController.toggleAdmin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.likeRestaurant)
router.delete('/like/:restaurantId', authenticated, userController.unlikeRestaurant)

//Category
router.get('/admin/categories', authenticatedForAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedForAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedForAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedForAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedForAdmin, categoryController.deleteCategory)

module.exports = router