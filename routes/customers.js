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
	User.listCustomers()
	.then(function(result){
		res.render('customers',{users: result});
	})
	.catch(next);
})

// create a customer createCustomer
router.post('/', function(req,res,next){
	User.createCustomer(req.body.name)
	.then(function(result){
		res.redirect('/customers/')
	})
	.catch(next);
})

//delete customer
router.delete('/:userId',function(req,res,next){
	User.deleteUser(req.params.userId)
	.then(function(result){
		res.redirect('/customers/')
	})
	.catch(next);
})

router.put('/:userId',function(req,res,next){
	User.customerToEmployee(req.params.userId)
	.then(function(result){
		res.redirect('/customers/')
	})
	.catch(next);
})

router.put('/:deptId/employee/:userId',function(req,res,next){
	User.employeeToCustomer(req.params.userId)
	.then(function(result){
		res.redirect('/customers/')
	})
})









router.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});