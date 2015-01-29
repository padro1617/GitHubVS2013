window.App = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap']);

angular.module('app').config(function ($routeProvider) {
	$routeProvider.
		when('/', {
			controller: 'DepartmentCtrl',
			templateUrl: '/tmpl/department.html'
		}).
		when('/department', {
			controller: 'DepartmentCtrl',
			templateUrl: '/tmpl/department.html'
		}).
		when('/user', {
			controller: 'UserCtrl',
			templateUrl: '/tmpl/user.html'
		}).
		when('/question', {
			controller: 'QuestionCtrl',
			templateUrl: '/tmpl/question.html'
		}).
		when('/questionnaire', {
			controller: 'QuestionnaireCtrl',
			templateUrl: '/tmpl/questionnaire.html'
		}).
		when('/report', {
			controller: 'ReportCtrl',
			templateUrl: '/tmpl/report.html'
		}).
		when('/qsreport', {
			controller: 'QSReportCtrl',
			templateUrl: '/tmpl/qsreport.html'
		}).
		otherwise({
			redirectTo: '/'
		});
});