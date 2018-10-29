const mysql = require('promise-mysql');	// mysql 모듈의 promise 버전

// rds 정보 입력 : hostname, username, password, default DB
const dbConfig = {
    host : 'influanswer.cxiilidde2gi.us-east-1.rds.amazonaws.com',
    port : 3306,
    user : 'admin',
    password : 'masterpassword',
    database : 'Influanswer',
    connectionLimit : 20
};

module.exports = mysql.createPool(dbConfig);// connection pool을 module화