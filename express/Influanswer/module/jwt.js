const jwt = require('jsonwebtoken');

const secretKey = require('../config/secretKey.js').secret;


module.exports = {
  sign : function(id, index) {
    const options = {
      algorithm : "HS256",
    };
    const payload = {
      id : id,
      index : index
    };
    let token = jwt.sign(payload, secretKey, options);
    return token;
  },
  verify : function(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    }
    catch(err) {
      if(err.message === 'jwt expired') throw "10402";
      else if(err.message === 'invalid token') throw "10401";
    }
    if(!decoded) {
      return -1;
    }else {
      return decoded;
    }
  }
};
