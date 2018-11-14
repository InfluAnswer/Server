const db = require('../express/Influanswer/module/db.js')
const request = require('request-promise')

const selectContractAddressQuery =
`
SELECT contractTransaction FROM contractTransaction WHERE contractAddress is NULL AND contractTransaction is not NULL
`

const selectToMigrateQuery = // hits = 0 , conversionAction = 0 -> 생성된지 얼마 안됨
`
SELECT contract_id
FROM smartContract
WHERE hits = 0 AND conversionAction = 0 AND contract_id NOT IN (
	SELECT contract_id
	FROM contractTransaction
)
`

var option = {
	method: 'POST',
 	uri: 'http://localhost:3000/transaction/migrate',
 	body: {
		 	contract_id : ""
 	},
 	json: true // Automatically stringifies the body to JSON
}

setInterval(async function query(){
	let selectContractAddressResult = await db.queryParamNone(selectContractAddressQuery)
	if(!selectContractAddressResult){
		console.log("module query_1 error")
		return
	}

	for(var i = 0 ; selectContractAddressResult.length ; i++){
		request.post('http://localhost:3000/transaction/migrate_queue').form({contractTransaction : selectContractAddressResult[i].contractTransaction})
	}

}, 5000)

setInterval(async function query(){
	let selectToMigrateResult = await db.queryParamNone(selectToMigrateQuery)
	if(!selectToMigrateResult){
		console.log("module query_2 error")
		return
	}

	console.log(selectToMigrateResult)
	for(var i = 0 ; selectToMigrateResult.length ; i++){
		// await db.queryParamArr(`UPDATE smartContract
		// 												SET isQueue = 1
		// 												WHERE contract_id = ?
		// 											`, selectToMigrateResult[i].contract_id)
		console.log(selectToMigrateResult[i].contract_id)
		option.body.contract_id = selectToMigrateResult[i].contract_id
		request(options)
		.then(function(res) {
			console.log(res)
		})
		.catch(function(err) {
			console.log(err)
		})
		//request.post('http://localhost:3000/transaction/migrate').form({contract_id : selectToMigrateResult[i].contract_id})
	}

}, 10000)
