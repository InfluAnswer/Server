const express = require('express')
const router = express.Router()
const verify = require('../../module/user').verify
const userModule = require('../../module/user')

router.post('/', async (req, res, next) => {
  let user
  let token = req.headers.token
    try{
      user = await verify(token)
    } catch(err){
      next(err)
      return
    }

	try {
		if(!user.id || !token){
			next("400")
			return
		}

        console.log(user)
    if(user.index == 0){
      await userModule.logout_inf(user.id, token)
    } else{
      await userModule.logout_adv(user.id, token)
    }

	} catch(err) {
		next(err)
		return
	}

	res.r()
})

module.exports = router
