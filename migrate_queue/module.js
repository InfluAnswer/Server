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
	selectContractAddressResult.forEach((element, idx) => {
		request.post('http://localhost:3000/transaction/migrate_queue').form({contractTransaction : element.contractTransaction})
	})

}, 3000)

setInterval(async function query(){
	let selectToMigrateResult = await db.queryParamNone(selectToMigrateQuery)
	if(!selectToMigrateResult){
		console.log("module query_2 error")
		return
	}
	selectToMigrateResult.forEach((element, idx) => {
		request.post('http://localhost:3000/transaction/migrate').form({contract_id : element.contract_id})
	})

}, 10000)
