const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.post('/', async(req, res, next) => {
  let contractTransaction = req.body.contractTransaction
  let contractAddress
  try {

  	if(!contractTransaction){
  		next("400")
  		return
  	}

	contractAddress = await transactionModule.migrate_queue(contractTransaction)

	if(!contractAddress){
		next("1401")
		return
	}

	/*
	여기에 rds에 contractAddress 넣기
	*/

  } catch(err) {
  	next(err)
  	return
  }

  res.r({
  	contractAddress : contractAddress
  })
})

module.exports = router
