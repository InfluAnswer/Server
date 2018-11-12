const express = require('express')
const router = express.Router()
const campaign = require('../../module/campaign')
const verify = require('../../module/user').verify

router.post('/', async (req, res, next) => {
  let user = await verify(req.headers.token)

  let campaign_id = req.body.campaign_id
  let inf_id = user.id
  let tracking_url = req.body.tracking_url

	try {
    if(!campaign_id || !inf_id || !tracking_url){
      next("400")
      return
    }

    campaign.pick(campaign_id, inf_id, tracking_url)
	} catch(err) {
		next(err)
		return
	}

	res.r()
})

module.exports = router
