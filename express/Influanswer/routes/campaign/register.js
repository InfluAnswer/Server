const express = require('express')
const router = express.Router()
const campaign = require('../../module/campaign')
const upload = require('../../config/s3multer')
const verify = require('../../module/user').verify
const campaignImageUpload = upload.campaignImageUpload

router.post('/', campaignImageUpload.single('campaign_image'), async (req, res, next) => {
let user = await verify(req.headers.token)

let info = {}
info.adv_id = user.id
info.manager_name = req.body.manager_name
info.phone_number = req.body.phone_number
info.type = req.body.type
info.start_date = req.body.start_date
info.end_date = req.body.end_date
info.budget = req.body.budget
info.reward = req.body.reward
info.name = req.body.name
info.URL = req.body.URL
info.description = req.body.description
info.campaign_image = req.file.location

	try {
    if(!info.manager_name || !info.phone_number || !info.start_date || !info.end_date
    || !info.budget || !info.name || !info.URL || !info.description || !info.campaign_image){
      next("400")
      return
    }

    await campaign.register(info)

	} catch(err) {
		next(err)
		return
	}

	res.r()
})

router.delete('/', async (req, res, next) => {
let adv_id = req.user.id
let campaign_id = req.body.campaign_id

	try {
    if(!adv_id || !campaign_id){
      next("400")
      return
    }

    await campaign.delete(adv_id, campaign_id)

	} catch(err) {
		next(err)
		return
	}

	res.r()
})

module.exports = router
