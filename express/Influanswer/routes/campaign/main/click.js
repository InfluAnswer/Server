const express = require('express')
const router = express.Router()
const campaign = require('../../../module/campaign')
const verify = require('../../../module/user').verify

router.post('/', async (req, res, next) => {
  await verify(req.headers.token)

  let types = req.body.types
  let data

	try {
    if(!types){
      next("400")
      return
    }

    data = await campaign.click(types)

	} catch(err) {
		next(err)
		return
	}

	res.r(data)
})

module.exports = router
