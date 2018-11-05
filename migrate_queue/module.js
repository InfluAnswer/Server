const db = require('../express/Influanswer/module/db.js')
const request = require('request')

const selectContractAddressQuery =
`
SELECT contractTransaction FROM contractTransaction WHERE contractAddress is NULL
`

setInterval(async function query(){
	let selectResult = await db.queryParamArr(selectContractAddressQuery)

	selectResult.forEach((element, idx) => {
		request.post('http://localhost:3000/transaction/migrate_queue').form({contractTransaction : element.contractTransaction})
	})

}, 3000)
