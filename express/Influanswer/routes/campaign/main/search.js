const express = require('express')
const router = express.Router()
const campaign = require('../../../module/campaign')

router.post('/', async (req, res, next) => {
  await verify(req.headers.token)
  
  let types = req.body.types
  let keyword = req.body.keyword
  let data

	try {
    if(!types){
      next("400")
      return
    }

    data = await campaign.search(types, keyword)

	} catch(err) {
		next(err)
		return
	}

	res.r(data)
})

module.exports = router
