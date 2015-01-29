angular.module('app').controller('QuestionnaireCtrl', ['$scope', '$resource', function ($scope, $resource) {
	var Department = $resource('/api/department/:id');
	Department.query().$promise.then(function (departments) {
		$scope.departments = departments
	});

	var Question = $resource('/api/question/:id');
	Question.query().$promise.then(function (questions) {
		$scope.questions = questions
	});

	var User = $resource('/api/user/:id');
	User.query().$promise.then(function (users) {
		$scope.users = users;
	});

	var Questionnaire = $resource('/api/questionnaire/:id');
	Questionnaire.query().$promise.then(function (questionnaires) {
		$scope.questionnaires = questionnaires;
	});

	$scope.deptId = 0;

	$scope.e_questionnaire = {
		qsnId: 0,
		qusId: 0,
		deptId: 0,
		no1: '',
		no2: '',
		no3: ''
	}

	$scope.save = function (qusId, no1, no2, no3) {
		var questionnaire = angular.copy($scope.e_questionnaire);
		questionnaire.qusId = qusId;
		questionnaire.no1 = no1;
		questionnaire.no2 = no2;
		questionnaire.no3 = no3;
		questionnaire.deptId = $scope.deptId;

		Questionnaire.save(questionnaire).$promise.then(function (info) {
			$scope.questionnaires.unshift(info);
		});
	}

}]);