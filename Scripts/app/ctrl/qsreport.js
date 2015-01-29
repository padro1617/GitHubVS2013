angular.module('app').controller('QSReportCtrl', ['$scope', '$resource', '$http', function ($scope, $resource, $http) {

	var Department = $resource('/api/department/:id');
	Department.query().$promise.then(function (departments) {
		$scope.departments = departments
	});

	var Question = $resource('/api/question/:id');
	Question.query().$promise.then(function (questions) {
		$scope.questions = questions
	});

	$scope.deptId = $scope.qusId = 0;

	var GetReport = function (qusId, deptId) {
		$http.post('/admin/qsreport', { qusId: qusId, deptId: deptId }).success(function (reports) {
			$scope.reports = reports;
		});
	}

	$scope.getReport = function () {
		if ($scope.deptId > 0 && $scope.qusId > 0) {
			GetReport($scope.qusId, $scope.deptId);
		}
	}

}]);