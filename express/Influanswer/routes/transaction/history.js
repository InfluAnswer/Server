const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.get('/', async(req, res, next) => {
  let page = req.query.page
  let transactionHash = req.query.transactionHash
  let conversionAction

  try {
  	if(!page || !transactionHash){
  		next("400")
  		return
  	}

	conversionAction = await transactionModule.history(page, transactionHash)
  } catch(err) {
  	next(err)
  	return
  }

  res.r({
  	conversionAction : conversionAction
  })
})

module.exports = router
