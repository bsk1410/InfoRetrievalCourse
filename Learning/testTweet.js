app = angular.module('myApp',['ngSanitize']);
app.controller('myCtrl',function($scope, $http){
	
var queryURL = "http://127.0.0.1:5000/";
		
$http.get(queryURL).then(function(response){
	$scope.results = response.data;//.data.response.docs;
	//document.getElementById('test').innerHTML = response.data
	console.log(response.data)
});
	
})