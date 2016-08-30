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
    //currentPage is 2.. not crazy about this.. we call this a magic number.. what does 2 actually do?
		res.render('departments', {
      title: 'acme_users',
      currentPage: 2,
      departments:deptList,
      defaultDept:defaultDept
    });
	})
	.catch(next);
})

router.post('/',function(req,res,next){
  //naming.. createDepartment.. what's a Dept? I know what a Department is.. not a Dept.. :)
	Department.createDept(req.body.department)
	.then(function(department){
		res.redirect('/departments/' + department.id );
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
  //nice use of spread
	Promise.all([Department.listAllDepartment(), Department.getDefault(), 
		User.listUserInADept(req.params.deptId), Department.getCurrentDept(req.params.deptId)])
	.spread(function(deptList, defaultDept, userList, currentDept){
		res.render('departments',
		 {title: 'acme_users', showDept: req.params.deptId,
			departments:deptList, currentPage: 2,
			defaultDept:defaultDept, users: userList,
			currentDept: currentDept
		});
	})
	.catch(next);
});

//restul /:id/employees not /employee

router.post('/:id/employee',function(req,res,next){
	User.createEmployee(req.body.name, req.params.id)
	.then(function(results){
		res.redirect('/departments/' + req.params.id);
	})
	.catch(next);
});

//again restful... 
router.delete('/:deptId/employee/:userId', function(req,res,next){
	User.deleteUser(req.params.userId)
	.then(function(){
		res.redirect('/departments/' + req.params.deptId);
	})
	.catch(next);
});


//put this in app.js
router.use(function(err, req, res, next) {
	console.log("Oh noes!!!!!");
	console.log(err, err.stack);
});
