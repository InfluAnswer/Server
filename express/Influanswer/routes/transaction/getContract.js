const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.get('/', async(req, res, next) => {
  let contractTransaction = req.query.contractTransaction
  let contractAddress
  console.log(contractTransaction)

  try {
  	if(!contractTransaction){
  		next("400")
  		return
  	}

	contractAddress = await transactionModule.get_contract(contractTransaction)
  } catch(err) {
  	next(err)
  	return
  }

  res.r({
  	contractAddress : contractAddress
  })
})

module.exports = router
