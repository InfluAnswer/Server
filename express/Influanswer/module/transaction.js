const Web3 = require('web3')
const solc = require('solc')
const fs = require('fs')
const hexToDec = require('hex-to-dec')
const db = require('./db')

const contractJson = require('../../../build/contracts/conversionAction.json')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
module.exports = {
    migrate_queue : async(contractTransaction) => {
      let transactionReceipt = web3.eth.getTransactionReceipt(contractTransaction)
      let contractAddress

      if(transactionReceipt == null){
        return "wait"
      }

      contractAddress = transactionReceipt.contractAddress

      // let insertAddressQuery =
      // `
      // INSERT INTO smartContract(contractAddress)
      // VALUES (?)
      // `
      // let insertResult = await db.queryParamArr(insertAddressQuery, contractAddress)

      let updateAddressQuery =
      `
      UPDATE contractTransaction
      SET contractAddress = ?
      WHERE contractTransaction = ?
      `
      let updateResult = await db.queryParamArr(updateAddressQuery,[contractAddress, contractTransaction])

      return contractAddress
    },
    migrate : async (contract_id) => {
/*
나중에 writing_idx 받아와서 거기에 insert하는것 까지 하기
*/
      let code = fs.readFileSync('../../contracts/conversionAction.sol').toString()
      let compiledCode = solc.compile(code)

      let abiDefinition = JSON.parse(compiledCode.contracts[':conversionAction'].interface)
      let StorageContract = web3.eth.contract(abiDefinition)
      let byteCode = compiledCode.contracts[':conversionAction'].bytecode
      let deployedContract = StorageContract.new(contract_id ,{data: "0x" + byteCode, from: web3.eth.accounts[0], gas: 4700000})

      let insertAddressQuery =
      `
      INSERT INTO contractTransaction(contractTransaction, contract_id)
      VALUES (?, ?)
      `
      let addressResult = await db.queryParamArr(insertAddressQuery, [deployedContract.transactionHash, contract_id])

      console.log(deployedContract.transactionHash)
      return deployedContract.transactionHash
    },

    search : async(contractAddress) => {
      let contract = web3.eth.contract(contractJson['abi']).at(contractAddress)

      let contractResult = contract.getAction()
      console.log(contractResult)
      let conversionAction = {
        action : contractResult[0].c[0],
        hits : contractResult[1].c[0],
      }

      console.log(conversionAction)
      return conversionAction
    },

    write : async(gas, contractAddress, action, hits) => {
      let contract = web3.eth.contract(contractJson['abi']).at(contractAddress)

      let contractResult = contract.getAction()

      console.log(contractResult)
      if(contractResult[0].c[0] > action || contractResult[1].c[0] > hits){
        throw "1404"
      }

      let transactionHash = contract.setAction(action, hits,{from : web3.eth.accounts[0], gas : gas})

      console.log(transactionHash)
      let writeCAQuery =
      `
      UPDATE smartContract
      SET conversionAction = ?, hits = ?
      WHERE contract_id = (
      SELECT contract_id
      FROM contractTransaction
      WHERE contractAddress = ?
      )
      `

      let writeResult = await db.queryParamArr(writeCAQuery, [action, hits, contractAddress])
      if(!writeResult){
        return undefined
      }

      let contractTransactionQuery =
      `
      SELECT contractTransaction
      FROM contractTransaction
      WHERE contractAddress = ?
      `

      let contractTransactionResult = await db.queryParamArr(contractTransactionQuery, contractAddress)
      if(!contractTransactionResult){
        return undefined
      }

      let writeTransactionQuery =
      `
      INSERT INTO transaction(contractTransaction, transaction, orders)
      VALUES (?, ?,
      (
      SELECT count(*) + 1
      FROM transaction as A
      WHERE contractTransaction = ?
      )
             )
      `
      let writeTransactionResult = await db.queryParamArr(writeTransactionQuery, [contractTransactionResult[0].contractTransaction, transactionHash, contractTransactionResult[0].contractTransaction])
      if(!writeTransactionResult){
        return undefined
      }

      return transactionHash
    },

    history : async(page, contractTransaction) => {
      let getTransactionHashQuery =
      `
      SELECT transaction
      FROM transaction
      WHERE contractTransaction = ? AND orders = ?
      `

      let getTransactionHashResult = await db.queryParamArr(getTransactionHashQuery, [contractTransaction, page])
      if(!getTransactionHashResult){
        throw "500"
      }

      if(getTransactionHashResult.length == 0){
        throw "1405"
      }

      let transactionHash = getTransactionHashResult[0].transaction

      let input = web3.eth.getTransaction(transactionHash).input
      let action = input.substr(10, 64)
      let hits = input.substr(74, 64)
      let conversionAction = {
        conversionAction : hexToDec(action),
        hits : hexToDec(hits)
      }

      console.log(conversionAction)
      return conversionAction
    },
    get_contract : async(contractTransaction) => {
      let transactionReceipt = web3.eth.getTransactionReceipt(contractTransaction)

      console.log(transactionReceipt)
      let contractAddress
      if(transactionReceipt == null){
        return "wait"
      }

      contractAddress = transactionReceipt.contractAddress
      return contractAddress
    },
    mycontract_inf : async(inf_id) => {
      let returnData = new Array()

      let getContractInfoQuery =
      `
      SELECT *
      FROM (smartContract JOIN campaign USING (campaign_id)) JOIN contractTransaction USING(contract_id)
      WHERE inf_id = ?
      `

      let getContractInfoResult = await db.queryParamArr(getContractInfoQuery, inf_id)
      if(!getContractInfoResult){
        throw "500"
      }

      for(i in getContractInfoResult){
        let form = {}

        form.contract_id = getContractInfoResult[0].contract_id
        form.campaign_id = getContractInfoResult[0].campaign_id
        form.inf_id = getContractInfoResult[0].inf_id
        form.adv_id = getContractInfoResult[0].adv_id
        form.type = getContractInfoResult[0].type
        form.reward = getContractInfoResult[0].reward
        form.start_date = getContractInfoResult[0].start_date
        form.end_date = getContractInfoResult[0].end_date
        form.image = getContractInfoResult[0].image
        form.hits = getContractInfoResult[0].hits
        form.conversionAction = getContractInfoResult[0].conversionAction
        form.contractAddress = getContractInfoResult[0].contractAddress
        form.contractTransaction = getContractInfoResult[0].contractTransaction

        returnData.push(form)
      }

      return returnData
    },
    mycontract_adv : async(adv_id) => {
      let returnData = new Array()

      let getContractInfoQuery =
      `
      SELECT *
      FROM (smartContract JOIN campaign USING (campaign_id)) JOIN contractTransaction USING(contract_id)
      WHERE adv_id = ?
      `

      let getContractInfoResult = await db.queryParamArr(getContractInfoQuery, adv_id)
      if(!getContractInfoResult){
        throw "500"
      }

      for(i in getContractInfoResult){
        let form = {}

        form.contract_id = getContractInfoResult[i].contract_id
        form.campaign_id = getContractInfoResult[i].campaign_id
        form.inf_id = getContractInfoResult[i].inf_id
        form.adv_id = getContractInfoResult[i].adv_id
        form.type = getContractInfoResult[i].type
        form.reward = getContractInfoResult[i].reward
        form.start_date = getContractInfoResult[i].start_date
        form.end_date = getContractInfoResult[i].end_date
        form.image = getContractInfoResult[i].image
        form.hits = getContractInfoResult[i].hits
        form.conversionAction = getContractInfoResult[i].conversionAction
        form.contractAddress = getContractInfoResult[i].contractAddress
        form.contractTransaction = getContractInfoResult[i].contractTransaction

        returnData.push(form)
      }

      return returnData
    }
}
