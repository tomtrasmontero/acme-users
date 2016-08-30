var http = require('http');

var server = http.createServer(require('./app'));
//require models User and Department so you can sync to database
var models = require('./db');
var User = models.User;
var Department = models.Department;

//require model index and sync up database before connecting to the server
//add a sync method to your db export.. 
//don't sync everytime-- sync based on environment varialbe
models.User.sync({force: true})//force: true
.then(function(){
	return models.Department.sync({force: true}); 
})
.then(function(){
	server.listen(process.env.PORT, function(){
		console.log('You are listening on port ' + process.env.PORT);
	});
})
.catch(console.error);
