//COLLECTS THE PACKAGED API ENDPOINTS AND PREFIXES THEM WITH THE PATH /API
const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

//HOMEPAGE ROUTER.USE STATEMENT COLLECTS THE PACKAGED API ENDPOINTS AND PREFIXES THEM JUST WITH "/" TO SIGNIFY THE HOMEPAGE
const homeRoutes = require('./home-routes.js');

router.use('/', homeRoutes);

//ADDITIONAL STEP FOR THE API ROUTING INDEX.JS IS THIS WEEDING OUT PROCESS BEFORE IT REACHES AN ENDPOINT
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;