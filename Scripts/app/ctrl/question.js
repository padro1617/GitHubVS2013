angular.module('app').controller('QuestionCtrl', ['$scope', '$resource', function ($scope, $resource) {
	var Question = $resource('/api/question/:id');
	Question.query().$promise.then(function (questions) {
		$scope.questions = questions
	});

	$scope.e_question = {
		qusId: 0,
		queNo: 0,
		qusTitle: ''
	}
	$scope.question = angular.copy($scope.e_question);

	$scope.create = function () {
		$scope.question.qusId = 0;
		Question.save($scope.question).$promise.then(function (info) {
			$scope.questions.unshift(info);
			$scope.question = angular.copy($scope.e_question);
		});
	}
}]);