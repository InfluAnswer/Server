const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.post('/', async(req, res, next) => {
  let idx = req.body.idx
  let contractTransaction
  try {
  	if(!idx){
  		next("400")
  		return
  	}
	contractTransaction = await transactionModule.migrate(idx)

	if(!contractTransaction){
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
  	contractTransaction : contractTransaction
  })
})

module.exports = router
