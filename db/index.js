//require sequelize to access the orm and in turn will access postgresSQL
var Sequelize = require('sequelize');
//requiring bluebird to use Promise.all
var Promise = require('bluebird');
var db = new Sequelize('postgres://localhost:5432/acme_users',{
	//disable logging; default: console.log
	logging: false
});


//define and create model for the 'User' and 'Department'
var User = db.define('user', {
	user: Sequelize.STRING
},{
	classMethods:{
		createEmployee: function(name,deptId){
			return User.create({
				user: name,
				deptId: deptId
			});
		},
		createCustomer: function(name){
			return User.create({
				user: name
			});
		},
		listCustomers: function(){
			return User.findAll({
				where: {
					deptId: null
				}
			});
		},
		customerToEmployee: function(userId){
			return Department.getDefault()
			.then(function(result){
				User.update({
					deptId: result.id},
					{where:{ id:userId}
				});
			});
		},
		employeeToCustomer: function(userId){
			return User.update({
				deptId: null},
				{where:{ id: userId}
			});
		},
		listUserInADept: function(deptId){
			return User.findAll({
				where:{
					deptId: deptId
				}
			});
		},
		deleteUser: function(userId){
      //how about findById?
			return User.findOne({
				where:{
					id: userId
				}
			})
			.then(function(result){
				result.destroy();
			});
		}
	}
});

var Department = db.define('department', {
  //i would name this name
	department: {
		type: Sequelize.STRING
	},
	isDefault: {
		type: Sequelize.ENUM('Yes','No'),//only two values-- use a boolean
		defaultValue: 'No'
	}
},{
	hooks: {
	},
	classMethods:{
		getDefault: function(){
			return Department.findOne({
				where: {
					isDefault: 'Yes'
				}
			})
      .then(function(department){
        if(department)
          return department;
        return Department.create({
          name: 'Accounting',
          isDefault: 'Yes'
        });
      });
		},
		createDept: function(dept){
			return Department.findOrCreate({
				where: {
					department: dept
				}
			})
		},
		listAllDepartment: function(){
			return Department.findAll({});//necessary?
		},
		getCurrentDept: function(deptId){//isnt this just findById
			return Department.findOne({
				where: {
					id: deptId
				}
			})
		},
		makeDefault: function(deptId){
			var oldDefaultDept= Department.update({
				isDefault: 'No'},
				{where: {isDefault: 'Yes'}
			});

			var newDefaultDept = Department.update({
				isDefault: 'Yes'},
				{where: {id: deptId}
			});
      //not good.... you don't know which will happen first if your second one happens before first you will have an issue..
      //find the old one... update it.. then find the new one and update it.
			return Promise.all([newDefaultDept, oldDefaultDept])
		}
	}
});


// Department can be renamed using (Department, {as: ' dept'})
User.belongsTo(Department, {as:'dept'});


//exports models & functions
module.exports = {
	User: User,
	Department: Department,
}
