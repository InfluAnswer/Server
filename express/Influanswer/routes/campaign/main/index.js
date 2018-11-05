const express = require('express');
const router = express.Router();

const clickRouter = require('./click.js')
const searchRouter = require('./search.js')

router.use('/click', clickRouter)
router.use('/search', searchRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'main' });
});

module.exports = router;
