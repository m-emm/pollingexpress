
export default	function config($routeProvider) {
		$routeProvider.when('/user/:id', {
			templateUrl : 'user/index.html'
		}).when('/user/', {
      templateUrl : 'user/index.html'
		}).when('/admin/', {
      templateUrl : 'admin/index.html'
    }).when('/results/', {
      templateUrl : 'results/index.html'
    }).otherwise({
			redirectTo : '/user'
		});

	}


