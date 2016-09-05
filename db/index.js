//require sequelize to access the orm and in turn will access postgresSQL
var Sequelize = require('sequelize');
//requiring bluebird to use Promise.all
var Promise = require('bluebird');
var db = new Sequelize(process.env.DATABASE_URL,{
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
			})
		},
		createCustomer: function(name){
			return User.create({
				user: name
			})
		},
		listCustomers: function(){
			return User.findAll({
				where: {
					deptId: null
				}
			})
		},
		customerToEmployee: function(userId){
			return Department.getDefault()
			.then(function(result){
				User.update({
					deptId: result.id},
					{where:{ id:userId}
				})
			})
		},
		employeeToCustomer: function(userId){
			return User.update({
				deptId: null},
				{where:{ id: userId}
			})
		},
		listUserInADept: function(deptId){
			return User.findAll({
				where:{
					deptId: deptId
				}
			})
		},
		deleteUser: function(userId){
			return User.findOne({
				where:{
					id: userId
				}
			})
			.then(function(result){
				result.destroy();
			})
			.catch(function(err){
				throw err;
			});
		}
	}
});

var Department = db.define('department', {
	department: {
		type: Sequelize.STRING
	},
	isDefault: {
		type: Sequelize.ENUM('Yes','No'),
		defaultValue: 'No'
	}
},{
	hooks: {
		beforeCreate: function(dept){
// !!! need to return promise object since it is async, will get null if it is not returned
			return Department.findAll({
				where: {
					isDefault: 'Yes'
				}
			})
			.then(function(results){
				if(results.length === 0){
					dept.isDefault = 'Yes'
				}
			})	
		}
	},
	classMethods:{
		getDefault: function(){
			return Department.findOne({
				where: {
					isDefault: 'Yes'
				}
			})
		},
		createDept: function(dept){
			return Department.findOrCreate({
				where: {
					department: dept
				}
			})
		},
		listAllDepartment: function(){
			return Department.findAll({});
		},
		getCurrentDept: function(deptId){
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