myApp.controller('page1Controller', ['$scope', function($scope){
	$scope.user = {
		firstname: "triyan",
		lastname: "wibowo",
		run: function(destination){
			return this.firstname + " is running to " + destination;
		}
	}
}]);
