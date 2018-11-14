const db = require('../express/Influanswer/module/db.js')
const request = require('request')

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

setInterval(async function query(){
	let selectContractAddressResult = await db.queryParamNone(selectContractAddressQuery)
	if(!selectContractAddressResult){
		console.log("module query_1 error")
		return
	}

	for(i in selectContractAddressResult){
		request.post('http://localhost:3000/transaction/migrate_queue').form({contractTransaction : selectContractAddressResult[i].contractTransaction})
	}

}, 5000)

setInterval(async function query(){
	let selectToMigrateResult = await db.queryParamNone(selectToMigrateQuery)
	if(!selectToMigrateResult){
		console.log("module query_2 error")
		return
	}

	for(i in selectToMigrateResult){
		await db.queryParamArr(`UPDATE smartContract
														SET isQueue = 1
														WHERE contract_id = ?
													`, selectToMigrateResult[i].contract_id)
		request.post('http://localhost:3000/transaction/migrate').form({contract_id : selectToMigrateResult[i].contract_id})
	}

}, 10000)
