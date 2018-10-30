const express = require('express');
const router = express.Router();

const transactionMigrateRouter = require('./migrate')
const transactionHistoryRouter = require('./history')
const transactionSearchRouter = require('./search')
const transactionWriteRouter = require('./write')
const transactionMigrateQueueRouter = require('./migrate_queue')
const transactionGetContractQueueRouter = require('./getContract')

router.use('/migrate', transactionMigrateRouter)
router.use('/history', transactionHistoryRouter)
router.use('/search', transactionSearchRouter)
router.use('/write', transactionWriteRouter)
router.use('/migrate_queue', transactionMigrateQueueRouter)
router.use('/getContract', transactionGetContractQueueRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'transaction' });
});


module.exports = router
