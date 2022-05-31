//IMPORT CONNECTION TO THE DB
const sequelize = require('../../config/connection');
//ADD LIBRARIES
const router = require('express').Router();
const { Post, User, Rate, Comment } = require('../../models');

//POST TO GET ALL
router.get('/', (req, res) => {
    Post.findAll({
        //ADD THE ORDER PROPERTY SO THE MOST CURRENT POSTS SHOW FIRST
        order: [
            ['created_at', 'DESC']
        ],
        attributes: ['id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],

        include: [
            // MODELS TO BE INCLUDED
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET ONE POST
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM rate WHERE post.id = rate.post_id)'), 'rate_count']
        ],
        include: [{
            model: User,
            attributes: ['username']
        }]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    //EXPECTS{ TITLE:'XYZPOST', PST_URL: 'HTTPS//XYZ.COM/PRESS', USER_ID: 1} 
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        });
});

//UPRATE BETWEEN ROUTER.POST AND /:ID PUT ROUTES
//PUT/API/POSTS/UPRATE
router.put('/uprate', (req, res) => {
    // IF SESSIONS EXIST
    if (req.session) {
        // PASS-IN SESSION AND DESTRUCTURED PROPERTIES
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

router.put('/:id', (req, res) => {
    Post.update({
        title: req.body.title
    }, {
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;