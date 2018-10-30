const Web3 = require('web3')
const solc = require('solc')
const fs = require('fs')
const db = require('./db')

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

process.on('message', async function(message) {
    // Process data
    let contractAddress = web3.eth.getTransactionReceipt(message.data).contractAddress
    let insertAddressQuery = 
    `
    INSERT INTO smartContract(contractAddress)
    VALUES (?)
    `
    let addressResult = await db.queryParamArr(insertAddressQuery, contractAddress)
     
    console.log(contractAddress)

    process.send({id: message.id, data: contractAddress});
});

// module.exports = {
// 	send : function(data) {
// 		console.log(data.id)
// 		console.log(data.data)
// 	}
// }