const db = require('./db')

module.exports = {
  mypage_get : async(adv_id) => {
    let returnData = {}

    let selectAdvQuery =
    `
    SELECT *
    FROM advertiser
    WHERE adv_id = ?
    `
    let selectAdvResult = await db.queryParamArr(selectAdvQuery, adv_id)
    if(!selectAdvResult){
      throw "500"
    }

    returnData.adv_id = selectAdvResult[0].adv_id
    returnData.company_name = selectAdvResult[0].company_name
    returnData.company_cate = selectAdvResult[0].company_cate
    returnData.representative = selectAdvResult[0].representative
    returnData.name = selectAdvResult[0].name
    returnData.phone_number = selectAdvResult[0].phone_number
    returnData.email = selectAdvResult[0].email
    returnData.fax = selectAdvResult[0].fax
    returnData.company_address = selectAdvResult[0].company_address
    returnData.company_number = selectAdvResult[0].company_number
    returnData.register_image = selectAdvResult[0].register_image

    return returnData
  },

  mypage_post : async(info) => {
    let updateAdvQuery =
    `
    UPDATE advertiser
    SET company_name = ?, company_cate = ?, representative = ?, name =?, phone_number = ?, email = ?, fax = ?, company_address = ?, company_number = ?, register_image = ?
    WHERE adv_id = ?
    `

    let updateAdvResult = await db.queryParamArr(updateAdvQuery,[info.company_name, info.company_cate, info.representative, info.name, info.phone_number, info.email, info.fax, info.company_address, info.company_number, info.register_image, info.adv_id])
    if(!updateAdvResult){
      throw "500"
    }
  }

}
