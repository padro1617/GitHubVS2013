angular.module('app').controller('MenuCtrl', ['$scope', '$location', function ($scope, $location) {
	$scope.menus = [
		{ title: '部门管理', url: '/department' },
		{ title: '用户管理', url: '/user' },
		{ title: '问题管理', url: '/question' },
		{ title: '问卷管理', url: '/questionnaire' },
		{ title: '报表分析', url: '/report' },
		{ title: '问题分析', url: '/qsreport' }
	];

	$scope.isActive = function (url) {
		return url == $location.path();
	}
}]);   