var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var path = require('path');
var routesDept =  require('./routes/departments.js');
var routesCust = require('./routes/customers.js')
//require db to access functions
var models = require('./db');
var methodOverride = require('method-override');
// require access to ORM models, default will be index.js, need to specify file is different name
var Department = models.Department;


//use swig
swig.setDefaults({ cache:false});
//set view engine to read html and use swig as the engine
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
//use body parser to read url
app.use(bodyParser.urlencoded({ extended: true}));
//use express static to form directory easier
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));
//use method override for delete
app.use(methodOverride('_method'));


//export app to server.js
module.exports = app;


// home route
app.get('/',function(req,res,next){
	Department.getDefault()
	.then(function(result){
		res.render("home", { header: 'Home' ,title: 'acme_users', currentPage: 1});
	})
	.catch(next);
});

//department route
app.use('/departments/', routesDept);
app.use('/customers/', routesCust);




app.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});