const db = require('./db')

module.exports = {
  click : async (types) => {
      let returnData = new Array()

      let selectContentQuery =
      `
      SELECT *
      FROM campaign
      WHERE type IN
      `
      for(i in types){
        types[i] = JSON.stringify(types[i])
      }

      selectContentQuery += "(" + types.join() + ")"
      let selectContentResult = await db.queryParamNone(selectContentQuery)
      if(!selectContentResult){
        throw "500"
      }

      for(i in selectContentResult){
        let form = new Object()

        form.campaign_id = selectContentResult[i].campaign_id
        form.name = selectContentResult[i].name
        form.type = selectContentResult[i].type
        form.reward = selectContentResult[i].reward
        form.description = selectContentResult[i].description
        form.image = selectContentResult[i].image

        returnData.push(form)
      }

      console.log(returnData)

      return returnData
  },

  search : async (types, keyword) => {
    let returnData = new Object()

    let selectContentQuery =
    `
    SELECT *
    FROM campaign
    WHERE type IN
    `
    for(i in types){
      types[i] = JSON.stringify(types[i])
    }

    selectContentQuery += "(" + types.join() + ")"
    selectContentQuery +=
    `
    AND name LIKE "%"?"%"
    `
    let selectContentResult = await db.queryParamArr(selectContentQuery, keyword)
    if(!selectContentResult){
      throw "500"
    }
    returnData.campaign_id = selectContentResult[0].campaign_id
    returnData.name = selectContentResult[0].name
    returnData.type = selectContentResult[0].type
    returnData.reward = selectContentResult[0].reward
    returnData.description = selectContentResult[0].description
    returnData.image = selectContentResult[0].image

    return returnData
  }
}
