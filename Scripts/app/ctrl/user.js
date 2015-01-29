angular.module('app').controller('UserCtrl', ['$scope', '$resource', function ($scope, $resource) {
	var User = $resource('/api/user/:id');
	var Department = $resource('/api/department/:id');

	User.query().$promise.then(function (users) {
		$scope.users = users
	});

	Department.query().$promise.then(function (departments) {
		$scope.departments = departments
	});

	$scope.codes = []

	for (var i = 65; i <= 90; i++) {
		$scope.codes.push(String.fromCharCode(i))
	}


	$scope.e_user = {
		userId: 0,
		deptId: 0,
		userCode: '',
		userName: ''
	}

	$scope.user = angular.copy($scope.e_user);

	$scope.create = function () {
		$scope.user.userId = 0;
		User.save($scope.user).$promise.then(function (info) {
			$scope.users.unshift(info);
			$scope.user.userCode = '';
			$scope.user.userName = '';
		});
	}
}]);