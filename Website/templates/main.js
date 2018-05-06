app = angular.module('myApp',['ngSanitize']);
	app.controller('myCtrl',function($scope, $http){
		//$scope.searchBox = "Hillary Clinton";
		var queryURL = "http://localhost:8983/solr/tweet_store/select?q=";
	
		$scope.getResults=function(){
			queryURL = "http://127.0.0.1:5000/";
			queryURL += ($scope.searchBox).replace(' ','%20');
			//console.log(queryURL)
			
			$http.get(queryURL).then(function(response){
				$scope.results = response;
			});

		}
	})