const express = require('express')
const router = express.Router()
const campaign = require('../../module/campaign')

router.post('/', async (req, res, next) => {
  let campaign_id = req.body.campaign_id
  let inf_id = req.body.inf_id
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
