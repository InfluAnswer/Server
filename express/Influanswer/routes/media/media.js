const express = require('express')
const router = express.Router()
const mediaModule = require('../../module/media.js')
const verify = require('../../module/user').verify

router.get('/', async(req, res, next) => {
let user = await verify(req.headers.token)
let inf_id = user.id // warning : user_index(광고주인지 인플루언서인지) 식별 안함
let returnData

  try {
  	if(!inf_id){
  		next("400")
  		return
  	}

    returnData = await mediaModule.media_get(inf_id)
	  } catch(err) {
  	next(err)
  	return
  }

  res.r()
})

router.post('/', async(req, res, next) => {
let inf_id = req.user.id // warning : user_index(광고주인지 인플루언서인지) 식별 안함
let SNS_name = req.body.SNS_name
let SNS_type = req.body.SNS_type
let SNS_URL = req.body.SNS_URL
let followers = req.body.followers

  try {
  	if(!inf_id || !SNS_name || !SNS_type || !SNS_URL || !followers){
  		next("400")
  		return
  	}

    await mediaModule.media_post(inf_id, SNS_name, SNS_type, SNS_URL, followers)
	  } catch(err) {
  	next(err)
  	return
  }

  res.r()
})

router.delete('/', async(req, res, next) => {
  let inf_id = req.user.id // warning : user_index(광고주인지 인플루언서인지) 식별 안함
  let SNS_index = req.body.SNS_index

    try {
    	if(!inf_id || !SNS_index){
    		next("400")
    		return
    	}
      await mediaModule.media_delete(inf_id, SNS_index)
  	  } catch(err) {
    	next(err)
    	return
    }

    res.r()
})

module.exports = router
