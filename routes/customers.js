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
    //again magic number 3
		res.render('customers',{users: result, currentPage: 3});
	})
	.catch(next);
})

// create a customer createCustomer
router.post('/', function(req,res,next){
	User.createCustomer(req.body.name)
	.then(function(customer){
		res.redirect('/customers/')
	})
	.catch(next);
})

//delete customer
router.delete('/:id',function(req,res,next){
	User.deleteUser(req.params.id)
	.then(function(result){
		res.redirect('/customers/')
	})
	.catch(next);
});

router.put('/:id',function(req,res,next){
	User.customerToEmployee(req.params.id)
	.then(function(employee){
		res.redirect('/departments/' + employee.departmentId)
	})
	.catch(next);
});

router.put('/:departmentId/employee/:id',function(req,res,next){
	User.employeeToCustomer(req.params.id)
	.then(function(result){
		res.redirect('/customers/');
	});
});

//again put this in app.js
router.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});
