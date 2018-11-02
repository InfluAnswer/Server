const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.post('/', async(req, res, next) => {
  let gas = req.body.gas
  let contractAddress = req.body.contractAddress
  let action = req.body.action
  let hits = req.body.hits
  let transactionHash

  try {
  	if(!gas || !contractAddress || !action || !hits){
  		next("400")
  		return
  	}

  	transactionHash = await transactionModule.write(gas, contractAddress, action, hits)

  	if(!transactionHash){
  		next("1401")
  		return
  	}
  } catch(err) {
  	next(err)
  	return
  }

  res.r({
  	transactionHash : transactionHash
  })
})

module.exports = router
