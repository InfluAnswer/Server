var express = require('express');
var router = express.Router();
var child_process = require('child_process')
var child = child_process.fork('./module/child.js')
var taskId = 0
var tasks = {}


child.on('message', function(message) {
    // Look up the callback bound to this id and invoke it with the result
    tasks[message.id](message.data);
});

/* GET home page. */
router.get('/', function(req, res, next) {
	let transactionHash = req.query.transactionHash
	addTask(transactionHash, function(result){
		res.send(result)
	})

module.exports = router;});



function addTask(data, callback) {
    var id = taskId++;

    child.send({id: id, data: data});

    tasks[id] = callback;
};


module.exports = router