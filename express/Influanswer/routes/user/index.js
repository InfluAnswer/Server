const express = require('express');
const router = express.Router();

const signUpRouter = require('./signUp.js')
const signInRouter = require('./signIn.js')

router.use('/signUp', signUpRouter)
router.use('/signIn', signInRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'user' });
});

module.exports = router;
