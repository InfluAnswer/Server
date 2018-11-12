const express = require('express')
const router = express.Router()
const advertiseModule = require('../../module/advertise')
const multer = require('multer')
const upload = require('../../config/s3multer')
const registerImageUpload = upload.registerImageUpload
router.get('/', async (req, res, next) => {
  let adv_id = req.user.id
  let returnData
	try {
		if(!adv_id){
			next("400")
			return
		}

    returnData = await advertiseModule.mypage_get(adv_id)

	} catch(err) {
		next(err)
		return
	}

	res.r(returnData)
})

router.post('/', registerImageUpload.single('register_image'), async (req, res, next) => {
  let info = {}
  info.adv_id = req.user.id
  info.company_name = req.body.company_name
  info.company_cate = req.body.company_cate
  info.representative = req.body.representative
  info.name = req.body.name
  info.phone_number = req.body.phone_number
  info.email = req.body.email
  info.fax = req.body.fax
  info.company_address = req.body.company_address
  info.company_number = req.body.company_number
  info.register_image = req.file.location // s3 url

  console.log(info)
	try {
		if(!info.adv_id || !info.company_name || !info.company_cate || !info.representative
      || !info.name || !info.phone_number || !info.email || !info.fax || !info.company_address || !info.company_number || !info.register_image){
			next("400")
			return
		}

    await advertiseModule.mypage_post(info)

	} catch(err) {
		next(err)
		return
	}

	res.r()
})

module.exports = router
