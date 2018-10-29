var express = require('express');
var router = express.Router();

const transactionRouter = require('./transaction/index.js')

router.use('/transaction', transactionRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
