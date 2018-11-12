const express = require('express');
const router = express.Router();

const createRouter = require('./create.js')
const mypageRouter = require('./mypage.js')

router.use('/create', createRouter)
router.use('/mypage', mypageRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'user' });
});

module.exports = router;
