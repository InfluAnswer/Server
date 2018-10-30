const db = require('../express/Influanswer/module/db.js')
const request = require('request')

const selectContractAddressQuery =
`
SELECT contractTransaction FROM contractTransaction WHERE contractAddress is NULL
`
// while(1){
// 	setTimeout(async function(){
// 	let selectResult = await db.queryParamArr(selectContractAddressQuery)

// 	console.log(selectResult)
// 	}, 3000)
// }

setInterval(async function query(){
	let selectResult = await db.queryParamArr(selectContractAddressQuery)

	for(i = 0 ; i < selectResult.length ; i++){
		request.post('http://localhost:3000/transaction/migrate_queue').form({contractTransaction : selectResult[i].contractTransaction})
	}
}, 3000)
