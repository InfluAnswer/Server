const db = require('./db')
const crypto = require('crypto-promise')
const jwt = require('./jwt')

module.exports = {
	signUp_Inf : async(inf_id, pw, name) => {
		let checkQuery =
		`
		SELECT EXISTS (
		SELECT *
		FROM influanswer
		WHERE inf_id = ?
		) AS SUCCESS
		`
		let checkResult = await db.queryParamArr(checkQuery, inf_id)
		if(checkResult[0].SUCCESS){
			throw "1500"
		}

		const salt = await crypto.randomBytes(32)
		const hashedpw = await crypto.pbkdf2(pw, salt.toString('base64'), 100000, 32, 'sha512')
		let insertUserQuery =
		`
		INSERT INTO influanswer (inf_id, pw, name, salt)
		VALUES(?, ?, ? ,?)
		`

		let insertUserResult = await db.queryParamArr(insertUserQuery, [inf_id, hashedpw.toString('base64'), name, salt.toString('base64')])
		if(!insertUserResult){
			throw "500"
		}
	},

	signUp_Adv : async(adv_id, pw, name) => {
		let checkQuery =
		`
		SELECT EXISTS (
		SELECT *
		FROM advertiser
		WHERE adv_id = ?
		) AS SUCCESS
		`
		let checkResult = await db.queryParamArr(checkQuery, adv_id)
		if(checkResult[0].SUCCESS){
			throw "1500"
		}

		const salt = await crypto.randomBytes(32)
		const hashedpw = await crypto.pbkdf2(pw, salt.toString('base64'), 100000, 32, 'sha512')

		let insertUserQuery =
		`
		INSERT INTO advertiser (adv_id, pw, name, salt)
		VALUES(?, ?, ? ,?)
		`
		let insertUserResult = await db.queryParamArr(insertUserQuery,[adv_id, hashedpw.toString('base64'), name, salt.toString('base64')])
		if(!insertUserResult){
			throw "500"
		}
	},

	signIn_Inf : async(inf_id, pw) => {
		let token
		let checkIdQuery =
		`
		SELECT EXISTS (
		SELECT *
		FROM influanswer
		WHERE inf_id = ?
		) AS SUCCESS
		`
		let checkIdResult = await db.queryParamArr(checkIdQuery, inf_id)
		if(!checkIdResult[0].SUCCESS){
			throw "1501"
		}

		let getPwQuery =
		`
		SELECT pw, salt, name
		FROM influanswer
		WHERE inf_id = ?
		`
		let getPwResult = await db.queryParamArr(getPwQuery, inf_id)
		if(!getPwResult){
			throw "500"
		}
		let hashedpw = await crypto.pbkdf2(pw, getPwResult[0].salt, 100000, 32, 'sha512')

		if(!(hashedpw.toString('base64') === getPwResult[0].pw)){
			throw "1502"
		} else {
			token = jwt.sign(inf_id,  getPwResult[0].name, "0")
			let updateTokenQuery =
			`
			UPDATE influanswer
			SET token = ?
			WHERE inf_id = ? AND pw = ?
			`
			let updateTokenResult = await db.queryParamArr(updateTokenQuery, [token, inf_id, hashedpw.toString('base64')])
		}
		return token
	},

	signIn_Adv : async(adv_id, pw) => {
		let token
		let checkIdQuery =
		`
		SELECT EXISTS (
		SELECT *
		FROM advertiser
		WHERE adv_id = ?
		) AS SUCCESS
		`
		let checkIdResult = await db.queryParamArr(checkIdQuery, adv_id)
		if(!checkIdResult[0].SUCCESS){
			throw "1501"
		}

		let getPwQuery =
		`
		SELECT pw, salt, name
		FROM advertiser
		WHERE adv_id = ?
		`
		let getPwResult = await db.queryParamArr(getPwQuery, adv_id)
		if(!getPwResult){
			throw "500"
		}

		let hashedpw = await crypto.pbkdf2(pw, getPwResult[0].salt, 100000, 32, 'sha512')

		if(!(hashedpw.toString('base64') === getPwResult[0].pw)){
				throw "1502"
		} else {
			token = jwt.sign(adv_id, getPwResult[0].name, "1")
			let updateTokenQuery =
			`
			UPDATE advertiser
			SET token = ?
			WHERE adv_id = ? AND pw = ?
			`
			let updateTokenResult = await db.queryParamArr(updateTokenQuery, [token, adv_id, hashedpw.toString('base64')])
		}

		return token
	},

	// pwChange : asnyc(token) => {
	//
	// }

	verify : async(token) => {
		if(!token){
			throw "10401"
		}

		let decoded = jwt.verify(token)
		let user = {}

		if(decoded == -1){
			return -1
		}

		user.id = decoded.id
		user.index = decoded.index

		if(!user){
			throw "10401"
		}

		return user
	},

	logout_inf : async(inf_id, token) => {
		let updateStateQuery =
		`
		UPDATE influanswer
		SET token = ?
		WHERE inf_id = ? AND token = ?
		`

		let updateStateResult = await db.queryParamArr(updateStateQuery, [null, inf_id, token])
		if(!updateStateResult){
			throw "500"
		}
	},

	logout_adv : async(adv_id, token) => {
		let updateStateQuery =
		`
		UPDATE advertiser
		SET token = ?
		WHERE adv_id = ? AND token = ?
		`
		let updateStateResult = await db.queryParamArr(updateStateQuery, [null, adv_id, token])
		if(!updateStateResult){
			throw "500"
		}
	}


}
