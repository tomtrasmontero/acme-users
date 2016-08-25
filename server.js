var http = require('http');

var server = http.createServer(require('./app'));
//require models User and Department so you can sync to database
var models = require('./db/index.js');
var User = models.User;
var Department = models.Department;

//require model index and sync up database before connecting to the server
models.User.sync({})//force: true
.then(function(){
	return models.Department.sync({}); 
})
.then(function(){
	server.listen(process.env.PORT, function(){
		console.log('You are listening on port ' + process.env.PORT);
	});
})
.catch(console.error);