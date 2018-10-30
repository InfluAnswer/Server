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

      let insertAddressQuery = 
      `
      INSERT INTO smartContract(contractAddress)
      VALUES (?)
      `
      let insertResult = await db.queryParamArr(insertAddressQuery, contractAddress)
     
      let updateAddressQuery =
      `
      UPDATE contractTransaction
      SET contractAddress = ?
      WHERE contractTransaction = ?
      `
      let updateResult = await db.queryParamArr(updateAddressQuery,[contractAddress, contractTransaction])

      return contractAddress
    },
    migrate : async (idx) => {
/*
나중에 writing_idx 받아와서 거기에 insert하는것 까지 하기
*/
      let code = fs.readFileSync('../../contracts/conversionAction.sol').toString()
      let compiledCode = solc.compile(code)

      let abiDefinition = JSON.parse(compiledCode.contracts[':conversionAction'].interface)
      let StorageContract = web3.eth.contract(abiDefinition)
      let byteCode = compiledCode.contracts[':conversionAction'].bytecode
      let deployedContract = StorageContract.new(idx,{data: "0x" + byteCode, from: web3.eth.accounts[0], gas: 4700000})

      let insertAddressQuery = 
      `
      INSERT INTO contractTransaction(contractTransaction)
      VALUES (?)
      `
      let addressResult = await db.queryParamArr(insertAddressQuery, deployedContract.transactionHash)
     
      console.log(deployedContract.transactionHash)
      return deployedContract.transactionHash
    },

    search : async(contractAddress) => {
      let contract = web3.eth.contract(contractJson['abi']).at(contractAddress)

      let contractResult = contract.getAction()
      let conversionAction = {
        download : contractResult[0].c[0],
        signUp : contractResult[1].c[0],
        hits : contractResult[2].c[0],
        buy : contractResult[3].c[0]
      }

      console.log(conversionAction)
      return conversionAction
    },

    write : async(gas, contractAddress, download, signUp, hits, buy) => {
      let contract = web3.eth.contract(contractJson['abi']).at(contractAddress)
      let transactionHash = contract.setAction(download, signUp, hits, buy, {from : web3.eth.accounts[0], gas : gas})
      
      console.log(transactionHash)
      let writeCAQuery = 
      `
      UPDATE smartContract 
      SET download = ?, signUp = ?, hits = ?, buy = ? 
      WHERE contractAddress = ?
      `

      let writeResult = await db.queryParamArr(writeCAQuery, [download, signUp, hits, buy, contractAddress])
      if(!writeResult){
        return undefined
      }

      let writeTransactionQuery =
      `
      INSERT INTO transaction(contractAddress, transaction)
      VALUES (?, ?)
      `
      let writeTransactionResult = await db.queryParamArr(writeTransactionQuery, [contractAddress, transactionHash])
      if(!writeTransactionResult){
        return undefined
      }

      return transactionHash
    },

    history : async(page, transactionHash) => {
      let input = web3.eth.getTransaction(transactionHash).input
      let download = "0x" + input.substr(10, 64)
      let signUp = input.substr(74, 64)
      let hits = input.substr(138, 64)
      let buy = input.substr(202, 64)
      let conversionAction = {
        download : hexToDec(download),
        signUp : hexToDec(signUp),
        hits : hexToDec(hits),
        buy : hexToDec(buy)
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
    }
}
