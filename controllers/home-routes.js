//SET-UP THE MAIN HOMEPAGE ROUTE - NOW- BECAUSE OF SPECIFYING A TEMPLATE ENGINE LIKE HANDLEBARS- WE CAN USE RES.RENDER() INSTEAD OF RES.SEND() OR RES.SENDFILE() FOR THE RESPONSE
const router = require('express').Router();

//IMPORT MODULES AND MODELS-NOTE LEAVE OUT COMMENT MODEL TO ADD IN LATER const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const { Post, User, Comment, Rate } = require('../models');

router.get('/', (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM rate WHERE post.id = rate.post_id)'), 'rate_count']
    ],
    include: [
      //   {
      //     model: Comment,
      //     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      //     include: {
      //       model: User,
      //       attributes: ['username']
      //     }
      //   },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // pass a single post object into the homepage template
      //MAKE AN ARRAY OF THE JAVASCRIPT OBJECTS FOR HANDLEBARS TO USE
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('homepage', { posts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM rate WHERE post.id = rate.post_id)'), 'rate_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      //SERIALIZE TO PERSIST IN STORAGE, TRANSFER, AND DISTRIBUTE
      const post = dbPostData.get({ plain: true });

      // PASS DATA TO TEMPLATE
      res.render('single-post', { post });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

module.exports = router;