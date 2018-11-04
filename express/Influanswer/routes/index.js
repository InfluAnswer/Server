var express = require('express');
var router = express.Router();

const transactionRouter = require('./transaction/index.js')
const userRouter = require('./user/index.js')
const childRouter = require('./child.js')

router.use('/transaction', transactionRouter)
router.use('/user', userRouter)
router.use('/child', childRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
