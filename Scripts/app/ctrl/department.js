angular.module('app').controller('DepartmentCtrl', ['$scope', '$resource', function ($scope, $resource) {
	var Department = $resource('/api/department/:id');
	Department.query().$promise.then(function (departments) {
		$scope.departments = departments
	});

	$scope.department = {
		deptId: 0,
		deptName: ''
	}

	$scope.create = function () {
		$scope.department.deptId = 0;
		Department.save($scope.department).$promise.then(function (info) {
			$scope.departments.unshift(info);
			$scope.department.deptId = 0;
			$scope.department.deptName = '';
		});
	}
}]);