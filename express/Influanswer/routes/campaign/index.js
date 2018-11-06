const express = require('express');
const router = express.Router();

const mainRouter = require('./main/index.js')
const contentRouter = require('./content.js')
const pickRouter = require('./pick.js')

router.use('/main', mainRouter)
router.use('/content', contentRouter)
router.use('/pick', pickRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'campaign' });
});

module.exports = router;
