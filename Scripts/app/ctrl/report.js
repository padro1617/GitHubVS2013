angular.module('app').controller('ReportCtrl', ['$scope', '$resource', '$http', function ($scope, $resource, $http) {

	var Department = $resource('/api/department/:id');
	Department.query().$promise.then(function (departments) {
		$scope.departments = departments
	});

	$scope.changeDept = function () {
		$scope.reports = $scope.allReports.filter(function (d) {
			return d.deptId == $scope.deptId;
		});
	}

	$http.post('/admin/report').success(function (reports) {
		$scope.reports = $scope.allReports = reports;
	});
}]);