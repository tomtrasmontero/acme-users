var router = require('express').Router();
// require access to ORM models, default will be index.js, need to specify file is different name
var models = require('../db');
var Department = models.Department;
var User = models.User;
var Promise = require('bluebird');

//exports router so app.js can use the following router.get,router.post etc
module.exports = router;

//department
router.get('/',function(req,res,next){
	Promise.all([Department.listAllDepartment(), Department.getDefault()])
	.spread(function(deptList, defaultDept){
		res.render('departments', {title: 'acme_users', departments:deptList, defaultDept:defaultDept});
	})
	.catch(next);
})

router.post('/',function(req,res,next){
	Department.createDept(req.body.department)
	.then(function(results){
		res.redirect('/departments/');
	})
	.catch(next);
})

router.put('/:deptId',function(req,res,next){
	Department.makeDefault(req.params.deptId)
	.then(function(result){
		res.redirect('/departments/' + req.params.deptId);
	})
	.catch(next);
})

router.get('/:deptId', function(req,res,next){
	Promise.all([Department.listAllDepartment(), Department.getDefault(), 
		User.listUserInADept(req.params.deptId), Department.getCurrentDept(req.params.deptId)])
	.spread(function(deptList, defaultDept, userList, currentDept){
		res.render('departments',
		 {title: 'acme_users', showDept: req.params.deptId,
			departments:deptList, 
			defaultDept:defaultDept, 
			users: userList,
			currentDept: currentDept
		});
	})
	.catch(next);
});

router.post('/:id/employee',function(req,res,next){
	User.createEmployee(req.body.name,req.params.id)
	.then(function(results){
		res.redirect('/departments/' + req.params.id);
	})
	.catch(next);
})

router.delete('/:deptId/employee/:userId', function(req,res,next){
	User.deleteUser(req.params.userId)
	.then(function(){
		res.redirect('/departments/' + req.params.deptId);
	})
	.catch(next);
})


router.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});