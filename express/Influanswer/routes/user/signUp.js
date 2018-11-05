const express = require('express')
const router = express.Router()
const user = require('../../module/user')

router.post('/', async (req, res, next) => {
	let index = req.body.index
	let user_id = req.body.id
	let user_pw = req.body.pw
	let user_name = req.body.name
	let token

	try {
		if(!user_id || !user_pw || !user_name){
			next("400")
			return
		}

		if(index == 0){
			await user.signUp_Inf(user_id, user_pw, user_name)
		} else {
			await user.signUp_Adv(user_id, user_pw, user_name)
		}

	} catch(err) {
		next(err)
		return
	}

	res.r(null)
})

module.exports = router
