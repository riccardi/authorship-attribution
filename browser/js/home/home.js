app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('MainCtrl', function($scope, $http) {
	$scope.myName = "Ashley";

	$scope.determineAuthor = function(unknownText) {
		console.log(unknownText);
		$http.get('/api/authors/'+unknownText)
		.then(function(response) {
			$scope.authorGuess = response.data;
		})
		.catch(function(err) {
			console.log(err);
		});
	};
});