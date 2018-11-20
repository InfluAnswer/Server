const express = require('express')
const router = express.Router()
const transactionModule = require('../../module/transaction.js')
const verify = require('../../module/user').verify

router.get('/', async(req, res, next) => {
  let user
    try{
      user = await verify(req.headers.token)
    } catch(err){
      next(err)
      return
    }
  let returnData

  try {
  	if(!user){
  		next("400")
  		return
  	}

    if(user.index == 0){
      returnData = await transactionModule.mycontract_inf(user.id)
    } else{
      returnData = await transactionModule.mycontract_adv(user.id)
    }

  } catch(err) {
  	next(err)
  	return
  }

  res.r(returnData)
})

module.exports = router
