const express = require('express')
const router = express.Router()
const user = require('../../module/user')

router.post('/', async (req, res, next) => {
	let index = req.body.index
	let user_id = req.body.id
	let user_pw = req.body.pw
	let token

	try {
		if(!user_id || !user_pw){
			next("400")
			return
		}

		if(index == 0){
			token = await user.signIn_Inf(user_id, user_pw)
		} else {
			token = await user.signIn_Adv(user_id, user_pw)
		}
		
	} catch(err) {
		next(err)
		return
	}

	res.r({
		token : token
	})
})

module.exports = router
