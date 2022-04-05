//ADD LIBRARIES
const router = require('express').Router();
const { Post, User, Rate } = require('../../models');

//POST TO GET ALL
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        //ADD THE ORDER PROPERTY SO THE MOST CURRENT POSTS SHOW FIRST
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: User,
            attributes: ['username']
        }]
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
        attributes: ['id', 'post_url', 'title', 'created_at'],
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
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => res.json(err));
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