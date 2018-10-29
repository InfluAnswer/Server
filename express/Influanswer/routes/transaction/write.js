const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')

router.post('/', async(req, res, next) => {
  let gas = req.body.gas
  let contractAddress = req.body.contractAddress
  let download = req.body.download
  let signUp = req.body.signUp
  let hits = req.body.hits
  let buy = req.body.buy
  let transactionHash

  try {
  	if(!gas || !contractAddress || !download || !signUp || !hits || !buy){
  		next("400")
  		return
  	}
  	
  	transactionHash = await transactionModule.write(gas, contractAddress, download, signUp, hits, buy)
  	
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
