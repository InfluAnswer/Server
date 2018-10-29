const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.get('/', async(req, res, next) => {
  let contractAddress = req.query.contractAddress
  let conversionAction
  try {
  	if(!contractAddress){
  		next("400")
  		return
  	}

  	conversionAction = await transactionModule.search(contractAddress)

  } catch(err) {
  	next(err)
  	return
  }

  res.r({
  	conversionAction : conversionAction
  })
})

module.exports = router
