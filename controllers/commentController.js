const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res, next) => {
    req.body.UserId = req.user.id
    Comment.create(req.body)
      .then(() => { return res.redirect(`restaurants/${req.body.RestaurantId}`) })
      .catch(err => next(err))
  }
}

module.exports = commentController