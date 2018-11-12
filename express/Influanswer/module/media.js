const db = require('./db')

module.exports = {
  media_get : async (inf_id) => {
    let returnData = new Array()

    let selectMediaQuery =
    `
    SELECT *
    FROM SNS
    WHERE inf_id = ?
    `

    let selectMediaResult = await db.queryParamArr(selectMediaQuery, inf_id)
    if(!selectMediaResult){
      throw "500"
    }

    for(i in selectMediaResult){
      let obj = new Object()

      obj.SNS_index = selectMediaResult[i].SNS_index
      obj.SNS_type = selectMediaResult[i].SNS_type
      obj.SNS_URL = selectMediaResult[i].SNS_URL
      obj.SNS_name = selectMediaResult[i].SNS_name
      obj.followers = selectMediaResult[i].followers

      returnData.push(obj)
    }

    return returnData
  },

  media_post : async (inf_id, SNS_name, SNS_type, SNS_URL, followers) => {
    let insertMediaQuery =
    `
    INSERT INTO SNS(inf_id, SNS_name, SNS_type, SNS_URL, followers)
    VALUES (?, ?, ?, ?, ?)
    `
    console.log(inf_id, SNS_name, SNS_type, SNS_URL, followers)
    let insertMediaResult = await db.queryParamArr(insertMediaQuery, [inf_id, SNS_name, SNS_type, SNS_URL, followers])
    if(!insertMediaResult){
      throw "500"
    }
  },

  media_delete : async (inf_id, SNS_index) =>{
    let deleteMediaQuery =
    `
    DELETE
    FROM SNS
    WHERE SNS_index = ? AND inf_id = ?
    `

    let deleteMediaResult = await db.queryParamArr(deleteMediaQuery, [SNS_index, inf_id])
    if(!deleteMediaResult){
      throw "500"
    }

  }
}
