const db = require('./db')

module.exports = {
  click : async (types) => {
      let returnData = new Array()
      let selectContentQuery = ""

      if(types.length == 0){ // types가 비어있으면 전체 호출
        selectAllQuery =
        `
        SELECT *
        FROM campaign
        `
      } else {
        selectContentQuery =
        `
        SELECT *
        FROM campaign
        WHERE type IN
        `
        for(i in types){
          types[i] = JSON.stringify(types[i])
        }

        selectContentQuery += "(" + types.join() + ")"
      }

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
    let returnData = new Array()
    let selectContentQuery = ""

    if(types.length == 0){
      selectContentQuery =
      `
      SELECT *
      FROM campain
      WHERE name LIKE "%"?"%"
      `
    } else {
      selectContentQuery =
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
    }

    let selectContentResult = await db.queryParamArr(selectContentQuery, keyword)
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

    return returnData
  },

  pick : async(campaign_id, inf_id, tracking_url) => {
    let insertContractQuery =
    `
    INSERT INTO smartContract(campaign_id, inf_id, tracking_url)
    VALUES (?, ?, ?)
    `

    let insertContractResult = await db.queryParamArr(insertContractQuery,[campaign_id, inf_id, tracking_url])
    if(!insertContractResult){
      throw "500"
    }
  },

  //only advertiser
  register : async(info) => {
    let insertCampaignQuery =
    `
    INSERT INTO campaign(adv_id, manager_name, phone_number, type, start_date, end_date, budget, reward, name, URL, description, image)
    VALUES (?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?)
    `
    console.log(info)
    let insertCampaignResult = await db.queryParamArr(insertCampaignQuery, [info.adv_id, info.manager_name, info.phone_number, info.type, info.start_date, info.end_date, info.budget, info.reward, info.name, info.URL, info.description, info.campaign_image])
    if(!insertCampaignResult){
      throw "500"
    }
  },

  delete : async(adv_id, campaign_id) => {
    let deleteCampaignQuery =
    `
    delete
    FROM campaign
    WHERE adv_id = ? AND campaign_id = ?
    `

    let deleteCampaignResult = await db.queryParamArr(deleteCampaignQuery, [adv_id, campaign_id])
    if(!deleteCampaignResult){
      throw "500"
    }
  }
}
