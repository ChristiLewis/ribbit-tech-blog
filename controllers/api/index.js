//COLLECTS ENDPOINTS AND PREFIXES THEM
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
//ADD POST-ROUTE AND OTHERS AFTERWARD
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

router.use('/users', userRoutes);
//LINK POST MODEL AND ROUTE 
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;