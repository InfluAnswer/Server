const express = require('express');
const router = express.Router();

const transactionMigrateRouter = require('./migrate')
const transactionHistoryRouter = require('./history')
const transactionSearchRouter = require('./search')
const transactionWriteRouter = require('./write')

router.use('/migrate', transactionMigrateRouter)
router.use('/history', transactionHistoryRouter)
router.use('/search', transactionSearchRouter)
router.use('/write', transactionWriteRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'transaction' });
});


module.exports = router
