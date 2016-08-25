var router = require('express').Router();
// require access to ORM models, default will be index.js, need to specify file is different name
var models = require('../db');
var Department = models.Department;
var User = models.User;
var Promise = require('bluebird');

//exports router so app.js can use the following router.get,router.post etc
module.exports = router;

// Customers Page
router.get('/', function(req,res,next){
	res.render('customers');
})

// create a customer
// router.post



//delete customer
// router.delete







router.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});